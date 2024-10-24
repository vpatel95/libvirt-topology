package network

import (
	"errors"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	sm "github.com/vpatel95/session-manager"

	"github.com/vpatel95/topology-deployer/app/lib/common"
	"github.com/vpatel95/topology-deployer/app/model"
	"github.com/vpatel95/topology-deployer/globals"
)

type (
	Session     = sm.Session
	Network     = model.Network
	NetworkType = model.NetworkType
)

var (
	sessionManager = globals.SessionManager
)

func get(c *gin.Context) {
	var err error
	var nw *Network
	var sess *Session

	if sess = common.GetSession(c); sess == nil {
		c.JSON(http.StatusUnauthorized, gin.H{
			"message": "Unauthorized",
		})
		return
	}

	id, _ := strconv.Atoi(c.Param("id"))
	if nw, err = model.GetNetworkByID(uint(id)); err != nil {
		c.JSON(http.StatusNotFound, gin.H{
			"message": err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "success",
		"data":    nw,
	})
}

func create(c *gin.Context) {
	var nw Network
	var err error
	var sess *Session

	if err = c.ShouldBindJSON(&nw); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": errors.New("Invalid request parameters"),
		})
		return
	}

	if sess = common.GetSession(c); sess == nil {
		c.JSON(http.StatusUnauthorized, gin.H{
			"message": "Unauthorized",
		})
		return
	}

	nw.UserID = sess.Get("user_id").(int)

	if err = model.CreateNetwork(nw); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": err.Error(),
		})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"message": "success",
		"data":    nw.Serialize(),
	})
}

func update(c *gin.Context) {
	common.RespondNotImplemented(c)
}

func delete(c *gin.Context) {
	common.RespondNotImplemented(c)
}

func attachedVms(c *gin.Context) {
	var nw *Network
	var err error
	var sess *Session
	var vms []model.AttachedVms

	if sess = common.GetSession(c); sess == nil {
		c.JSON(http.StatusUnauthorized, gin.H{
			"message": "Unauthorized",
		})
		return
	}

	id, _ := strconv.Atoi(c.Param("id"))
	if nw, err = model.GetNetworkByID(uint(id)); err != nil {
		c.JSON(http.StatusNotFound, gin.H{
			"message": err.Error(),
		})
		return
	}

	if vms, err = nw.GetAttachedVms(); err != nil {
		c.JSON(http.StatusNotFound, gin.H{
			"message": err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "success",
		"data":    vms,
	})
}
