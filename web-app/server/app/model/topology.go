package model

import (
	"github.com/vpatel95/topology-deployer/database"
	"gorm.io/gorm"
)

type Topology struct {
	gorm.Model
	Name            string           `gorm:"column:name;not null" json:"name"`
	UserID          int              `gorm:"column:user_id;not null" json:"user_id"`
	Networks        []Network        `gorm:"constraint:OnDelete:CASCADE;default:NULL"`
	VirtualMachines []VirtualMachine `gorm:"constraint:OnDelete:CASCADE;default:NULL"`
}

func (t *Topology) Serialize() JSON {
	return JSON{
		"id":      t.ID,
		"name":    t.Name,
		"user_id": t.UserID,
	}
}

func (t *Topology) Load(data JSON) {
	t.ID = uint(data["id"].(float64))
	t.Name = data["name"].(string)
	t.UserID = int(data["user_id"].(float64))
}

func (t *Topology) GetVms() ([]VmResp, error) {
	var err error
	var vms []VirtualMachine
	var vmsResp []VmResp

	db := database.DB

	if err = db.Model(t).
		Preload("Networks").
		Association("VirtualMachines").
		Find(&vms); err != nil {
		return nil, err
	}

	vmsResp = createVmResp(vms)

	return vmsResp, nil
}

func (t *Topology) GetNetworks() ([]Network, error) {
	var err error
	var objs []Network

	db := database.DB

	if err = db.Model(t).Association("Networks").Find(&objs); err != nil {
		return nil, err
	}

	return objs, nil
}

func MigrateTopology(db *gorm.DB) *gorm.DB {
	db.AutoMigrate(&Topology{})
	return db
}

func CreateTopology(t Topology) error {
	var err error
	if err = validateTopology(t, true); err != nil {
		return err
	}

	db := database.DB
	return db.Create(&t).Error
}

func DeleteTopology(t *Topology) error {
	db := database.DB.Unscoped()

	return db.Delete(t).Error
}

func GetTopologyByID(id uint) (*Topology, error) {
	var err error
	var topology Topology

	db := database.DB
	if err = db.First(&topology, id).Error; err != nil {
		return nil, err
	}

	return &topology, nil
}

func GetTopologyByName(name string) (*Topology, error) {
	var err error
	var topology Topology

	db := database.DB
	if err = db.Where("name = ?", name).First(&topology).Error; err != nil {
		return nil, err
	}

	return &topology, nil
}
