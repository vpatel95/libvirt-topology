package user

import (
	"errors"
	"log"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	sm "github.com/vpatel95/session-manager"

	"github.com/vpatel95/topology-deployer/app/lib/common"
	"github.com/vpatel95/topology-deployer/app/model"
	"github.com/vpatel95/topology-deployer/globals"
)

type (
	JSON           = map[string]interface{}
	Session        = sm.Session
	User           = model.User
	Topology       = model.Topology
	Network        = model.Network
	VirtualMachine = model.VirtualMachine
	VmResp         = model.VmResp
)

var (
	sessionManager = globals.SessionManager
)

func index(c *gin.Context) {
	var err error
	var users []User

	if users, err = model.GetUsers(); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "success",
		"users":   users,
	})
}

func get(c *gin.Context) {
	var err error
	var user *User

	id, _ := strconv.Atoi(c.Param("id"))
	if user, err = model.GetUserByID(uint(id)); err != nil {
		c.JSON(http.StatusNotFound, gin.H{
			"message": err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "success",
		"users":   user,
	})
}

func update(c *gin.Context) {
	var user User
	var err error

	if err = c.ShouldBindJSON(&user); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": errors.New("Invalid request parameters"),
		})
		return
	}

	id, _ := strconv.Atoi(c.Param("id"))
	if err = model.UpdateUser(uint(id), user); err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{
			"message": err.Error(),
		})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"message": "success",
		"data":    user.Serialize(),
	})
}

func delete(c *gin.Context) {
	log.Println("In User Delete")
	common.RespondNotImplemented(c)
}

func getUserTopologies(c *gin.Context) {
	var err error
	var user *User
	var topologies []Topology

	id, _ := strconv.Atoi(c.Param("id"))
	if user, err = model.GetUserByID(uint(id)); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": err.Error(),
		})
		return
	}

	if topologies, err = user.GetTopologies(); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": err.Error(),
		})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"message": "success",
		"data":    topologies,
	})
}

func getUserNetworks(c *gin.Context) {
	var err error
	var user *User
	var networks []Network

	id, _ := strconv.Atoi(c.Param("id"))
	if user, err = model.GetUserByID(uint(id)); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": err.Error(),
		})
		return
	}

	if networks, err = user.GetNetworks(); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": err.Error(),
		})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"message": "success",
		"data":    networks,
	})
}

func getUserVms(c *gin.Context) {
	var err error
	var user *User
	var vms []VmResp

	id, _ := strconv.Atoi(c.Param("id"))
	if user, err = model.GetUserByID(uint(id)); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": err.Error(),
		})
		return
	}

	if vms, err = user.GetVirtualMachines(); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": err.Error(),
		})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"message": "success",
		"data":    vms,
	})
}
