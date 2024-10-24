package model

import (
	"errors"

	valid "github.com/asaskevich/govalidator"
)

func isValidFlavor(flavor VmFlavor) bool {
	for _, FLAVOR := range VmFlavorList {
		if flavor == FLAVOR {
			return true
		}
	}
	return false
}

func validateVm(vmReq VmRB) error {
	if valid.IsNull(vmReq.Name) || (vmReq.TopologyID <= 0) ||
		(vmReq.UserID <= 0) || (vmReq.VNCPort < 5900 && vmReq.VNCPort > 5999) {
		return errors.New("Invalid request parameters")
	}

	if !isValidFlavor(vmReq.Flavor) && valid.IsNull(vmReq.Disk) &&
		(vmReq.Vcpu == 0) && (vmReq.Ram == 0) {
		return errors.New("Invalid request parameters")
	}

	return nil
}

func createVmResp(vms []VirtualMachine) []VmResp {
	var vmsResp []VmResp

	for _, vm := range vms {
		var vmResp VmResp
		vmResp.ID = vm.ID
		vmResp.Name = vm.Name
		vmResp.Flavor = vm.Flavor
		vmResp.VNCPort = vm.VNCPort
		vmResp.Disk = vm.Disk
		vmResp.Ram = vm.Ram
		vmResp.Vcpu = vm.Vcpu
		vmResp.TopologyID = vm.TopologyID
		vmResp.UserID = vm.UserID
		for _, net := range vm.Networks {
			var vmNet VmNet
			vmNet.ID = int(net.ID)
			vmNet.IPv4Address, _ = vm.GetAddrByNID(vmNet.ID, true)
			vmNet.IPv6Address, _ = vm.GetAddrByNID(vmNet.ID, false)
			vmResp.Networks = append(vmResp.Networks, vmNet)
		}
		vmsResp = append(vmsResp, vmResp)
	}

	return vmsResp
}
