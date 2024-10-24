package model

import (
	"errors"
	"net"

	"gorm.io/gorm"

	"github.com/vpatel95/topology-deployer/database"
)

const (
	PE  VmFlavor = "pe"
	CE  VmFlavor = "ce"
	DEV VmFlavor = "dev"

	PE_DISK  string = "80G"
	CE_DISK  string = "40G"
	DEV_DISK string = "320G"

	HEX_MEM  int = 16384
	OCTA_MEM int = 8192
	DEV_MEM  int = 32768

	QUAD_CPU int = 4
	DUAL_CPU int = 2
	DEV_CPU  int = 32
)

var (
	VmFlavorList = []VmFlavor{PE, CE, DEV}
)

type (
	VmFlavor string

	VmNet struct {
		ID          int    `json:"id"`
		IPv4Address string `json:"ipv4_address"`
		IPv6Address string `json:"ipv6_address"`
	}

	VmRB struct {
		Name       string   `json:"name"`
		Flavor     VmFlavor `json:"flavor"`
		VNCPort    int      `json:"vnc_port"`
		Disk       string   `json:"disk"`
		Ram        int      `json:"ram"`
		Vcpu       int      `json:"vcpu"`
		TopologyID int      `json:"topology_id"`
		UserID     int      `json:"user_id"`
		Networks   []VmNet  `json:"networks"`
	}

	VmResp struct {
		ID         uint     `json:"ID"`
		Name       string   `json:"name"`
		Flavor     VmFlavor `json:"flavor"`
		VNCPort    int      `json:"vnc_port"`
		Disk       string   `json:"disk"`
		Ram        int      `json:"ram"`
		Vcpu       int      `json:"vcpu"`
		TopologyID int      `json:"topology_id"`
		UserID     int      `json:"user_id"`
		Networks   []VmNet  `json:"vm_net"`
	}

	VirtualMachine struct {
		gorm.Model
		Name       string    `gorm:"column:name;unique;not null" json:"name"`
		Flavor     VmFlavor  `gorm:"type:enum('pe', 'ce', 'dev')" json:"flavor"`
		VNCPort    int       `gorm:"column:vnc_port;unique;not null" json:"vnc_port"`
		Disk       string    `gorm:"column:disk" json:"disk"`
		Ram        int       `gorm:"column:ram" json:"ram"`
		Vcpu       int       `gorm:"column:vcpu" json:"vcpu"`
		TopologyID int       `gorm:"column:topology_id;not null" json:"topology_id"`
		UserID     int       `gorm:"column:user_id;not null" json:"user_id"`
		Networks   []Network `gorm:"many2many:vm_networks; constraint:OnDelete:CASCADE"`
	}

	VmNetwork struct {
		VmID        int    `gorm:"column:virtual_machine_id;primaryKey;constraint:OnDelete:CASCADE"`
		NetworkID   int    `gorm:"column:network_id;primaryKey;constraint:OnDelete:CASCADE"`
		IPv4Address string `gorm:"column:ipv4_address;not null"`
		IPv6Address string `gorm:"column:ipv6_address;default:NULL"`
	}
)

func (vm *VirtualMachine) Serialize() JSON {
	return JSON{
		"id":          vm.ID,
		"name":        vm.Name,
		"flavor":      vm.Flavor,
		"vnc_port":    vm.VNCPort,
		"topology_id": vm.TopologyID,
		"user_id":     vm.UserID,
	}
}

func (vm *VirtualMachine) Load(data JSON) {
	vm.ID = uint(data["id"].(float64))
	vm.Name = data["name"].(string)
	vm.Flavor = data["flavor"].(VmFlavor)
	vm.VNCPort = data["vnc_port"].(int)
	vm.TopologyID = data["topology_id"].(int)
	vm.UserID = data["user_id"].(int)
}

func (vm *VirtualMachine) GetAllNetworks() ([]Network, error) {
	var err error
	var objs []Network

	db := database.DB

	if err = db.Model(vm).Association("Networks").Find(&objs); err != nil {
		return nil, err
	}

	return objs, nil
}

func (vm *VirtualMachine) GetNatNetworks() ([]Network, error) {
	var err error
	var objs []Network

	db := database.DB

	if err = db.Model(vm).
		Where("type = ?", "nat").Association("Networks").
		Find(&objs); err != nil {
		return nil, err
	}

	return objs, nil
}

func (vm *VirtualMachine) GetIsolatedNetwork() ([]Network, error) {
	var err error
	var objs []Network

	db := database.DB

	if err = db.Model(vm).
		Where("type = ?", "isolated").Association("Networks").
		Find(&objs); err != nil {
		return nil, err
	}

	return objs, nil
}

func (vm *VirtualMachine) GetMgmtNetwork() ([]Network, error) {
	var err error
	var objs []Network

	db := database.DB

	if err = db.Model(vm).
		Where("type = ?", "management").Association("Networks").
		Find(&objs); err != nil {
		return nil, err
	}

	return objs, nil
}

func (vm *VirtualMachine) GetMgmtIp() (string, error) {
	var err error
	var vmn VmNetwork

	db := database.DB

	mgmt_nws, err := vm.GetMgmtNetwork()
	err = db.First(&vmn, "network_id=? AND virtual_machine_id=?", mgmt_nws[0].ID, vm.ID).Error
	if err != nil {
		return "", err
	}

	return vmn.IPv4Address, nil
}

func (vm *VirtualMachine) GetAddrByNID(nid int, v4 bool) (string, error) {
	var err error
	var ip string
	var vmn VmNetwork

	db := database.DB

	err = db.First(&vmn, "network_id=? AND virtual_machine_id=?", nid, vm.ID).Error
	if err != nil {
		return "", err
	}

	if v4 {
		ip = vmn.IPv4Address
	} else {
		ip = vmn.IPv6Address
	}

	return ip, nil
}

func GetVirtualMachineByID(id uint) (*VirtualMachine, error) {
	var err error
	var vm VirtualMachine

	db := database.DB
	if err = db.First(&vm, id).Error; err != nil {
		return nil, err
	}

	return &vm, nil
}

func GetVmRespById(vid int) (*VmResp, error) {
	var vm VirtualMachine
	var err error

	db := database.DB
	if err = db.Model(vm).Limit(1).
		Preload("Networks").
		Association("VirtualMachines").
		Find(&vm, vid); err != nil {
		return nil, nil
	}

	vmRes := createVmResp([]VirtualMachine{vm})
	return &vmRes[0], nil
}

func MigrateVirtualMachine(db *gorm.DB) *gorm.DB {
	if err := db.SetupJoinTable(&VirtualMachine{}, "Networks", &VmNetwork{}); err != nil {
		panic(err)
	}
	db.AutoMigrate(&VirtualMachine{})
	return db
}

func CreateVm(vmReq VmRB) (*VirtualMachine, error) {
	var err error
	var vm VirtualMachine
	if err = validateVm(vmReq); err != nil {
		return nil, err
	}

	db := database.DB

	vm.Name = vmReq.Name
	vm.Flavor = vmReq.Flavor
	vm.VNCPort = vmReq.VNCPort
	vm.TopologyID = vmReq.TopologyID
	vm.UserID = vmReq.UserID
	for _, vmNet := range vmReq.Networks {
		var nw Network
		var ipNet *net.IPNet

		if err := db.First(&nw, vmNet.ID).Error; err != nil {
			return nil, err
		}

		vm.Networks = append(vm.Networks, nw)

		if nw.Type != Isolated {
			ip4 := net.ParseIP(vmNet.IPv4Address)
			if _, ipNet, err = net.ParseCIDR(nw.Subnet4); err != nil {
				return nil, err
			}

			if !(ipNet.Contains(ip4)) {
				return nil, errors.New("Invalid request parameters")
			}
		}

		if nw.HasV6 && len(vmNet.IPv6Address) != 0 {
			if nw.Type != Isolated {
				ip6 := net.ParseIP(vmNet.IPv6Address)
				if _, ipNet, err = net.ParseCIDR(nw.Subnet6); err != nil {
					return nil, err
				}
				if !(ipNet.Contains(ip6)) {
					return nil, errors.New("Invalid request parameters")
				}
			}
		}
	}

	if isValidFlavor(vm.Flavor) {
		switch vm.Flavor {
		case PE:
			vm.Ram = HEX_MEM
			vm.Vcpu = QUAD_CPU
			vm.Disk = PE_DISK
			break
		case CE:
			vm.Ram = OCTA_MEM
			vm.Vcpu = DUAL_CPU
			vm.Disk = CE_DISK
			break
		case DEV:
			vm.Ram = DEV_MEM
			vm.Vcpu = DEV_CPU
			vm.Disk = DEV_DISK
			break
		default:
			return nil, errors.New("Invalid request parameters")
		}
	}

	if vmReq.Ram > 0 {
		vm.Ram = vmReq.Ram
	}
	if vmReq.Disk != "" {
		vm.Disk = vmReq.Disk
	}
	if vmReq.Vcpu > 0 {
		vm.Vcpu = vmReq.Vcpu
	}

	// Begin database transaction.
	err = db.Transaction(func(tx *gorm.DB) error {
		if err := tx.Create(&vm).Error; err != nil {
			return err
		}

		for idx, nw := range vm.Networks {

			vmn := VmNetwork{
				VmID:        int(vm.ID),
				NetworkID:   int(nw.ID),
				IPv4Address: vmReq.Networks[idx].IPv4Address,
			}

			if len(vmReq.Networks[idx].IPv6Address) != 0 {
				vmn.IPv6Address = vmReq.Networks[idx].IPv6Address
			}

			if err := tx.Save(&vmn).Error; err != nil {
				return err
			}
		}
		return nil
	})

	// Transaction failed. Fail the VM creation
	if err != nil {
		return nil, err
	}

	return &vm, nil
}

func DeleteVm(vm *VirtualMachine) error {
	db := database.DB.Unscoped()

	return db.Delete(vm).Error
}
