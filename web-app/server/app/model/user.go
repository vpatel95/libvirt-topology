package model

import (
	"errors"

	"github.com/vpatel95/topology-deployer/database"
	"gorm.io/gorm"
)

type (
	User struct {
		gorm.Model
		Name            string `gorm:"column:name;not null" json:"name"`
		Email           string `gorm:"column:email;unique;not null" json:"email"`
		Username        string `gorm:"column:username;unique;not null" json:"username"`
		Password        string `gorm:"column:password;not null;not null" json:"password"`
		Topologies      []Topology
		Networks        []Network
		VirtualMachines []VirtualMachine
	}

	LoginRB struct {
		Username string `json:"username"`
		Password string `json:"password"`
	}
)

var (
	ErrEmailExists    = errors.New("Email already exists")
	ErrUsernameExists = errors.New("Username already exists")
)

var (
	selectFields = []string{"id", "name", "username", "email"}
)

func (u *User) GetTopologies() ([]Topology, error) {
	var err error
	var objs []Topology

	db := database.DB

	if err = db.Model(u).
		Preload("Networks").Preload("VirtualMachines").
		Association("Topologies").
		Find(&objs); err != nil {
		return nil, err
	}

	return objs, nil
}

func (u *User) GetNetworks() ([]Network, error) {
	var err error
	var objs []Network

	db := database.DB

	if err = db.Model(u).Association("Networks").Find(&objs); err != nil {
		return nil, err
	}

	return objs, nil
}

func (u *User) GetVirtualMachines() ([]VmResp, error) {
	var err error
	var vms []VirtualMachine
	var vmsResp []VmResp

	db := database.DB

	if err = db.Model(u).
		Preload("Networks").
		Association("VirtualMachines").
		Find(&vms); err != nil {
		return nil, err
	}

	vmsResp = createVmResp(vms)

	return vmsResp, nil
}

func (u *User) Serialize() JSON {
	return JSON{
		"id":       u.ID,
		"name":     u.Name,
		"username": u.Username,
		"email":    u.Email,
	}
}

func (u *User) Load(data JSON) {
	u.ID = uint(data["id"].(float64))
	u.Name = data["name"].(string)
	u.Username = data["username"].(string)
	u.Email = data["email"].(string)
}

func MigrateUser(db *gorm.DB) *gorm.DB {
	db.AutoMigrate(&User{})
	return db
}

func GetUserByUsername(uname string) (*User, error) {
	var err error
	var user User
	db := database.DB
	if err = db.Select(selectFields).Where("username = ?", uname).First(&user).Error; err != nil {
		return nil, err
	}

	return &user, nil
}

func GetUserByID(id uint) (*User, error) {
	var err error
	var user User
	db := database.DB
	if err = db.Select(selectFields).First(&user, id).Error; err != nil {
		return nil, err
	}

	return &user, nil
}

func GetUsers() ([]User, error) {
	var users []User

	db := database.DB
	if err := db.Select(selectFields).Find(&users).Error; err != nil {
		return nil, err
	}

	return users, nil
}

func CreateUser(user User) error {
	var err error
	if err = validateUser(user, true); err != nil {
		return err
	}

	if user.Password, err = hash(user.Password); err != nil {
		return err
	}

	db := database.DB
	return db.Create(&user).Error

}

func UpdateUser(id uint, user User) error {
	var err error
	if err = validateUser(user, false); err != nil {
		return err
	}

	u, err := GetUserByID(id)
	if err != nil {
		return err
	}

	u.Name = user.Name
	u.Email = user.Email
	u.Username = user.Username

	if user.Password, err = hash(user.Password); err != nil {
		return err
	}
	u.Password = user.Password

	db := database.DB
	return db.Model(&User{}).Updates(&u).Error
}
