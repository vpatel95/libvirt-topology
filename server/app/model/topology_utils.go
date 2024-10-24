package model

import (
	"errors"

	valid "github.com/asaskevich/govalidator"
	"github.com/vpatel95/topology-deployer/database"
)

var (
    ErrTopologyExists    = errors.New("Topology name already exists")
)

func validateTopology(t Topology, isCreate bool) error {
    var exists Topology
    db := database.DB

    if (valid.IsNull(t.Name)) {
        return errors.New("Invalid request parameters")
    }

    if (isCreate) {
        if err := db.Where("name = ?", t.Name).First(&exists).Error; err == nil {
            return ErrTopologyExists
        }
    }

    return nil
}

