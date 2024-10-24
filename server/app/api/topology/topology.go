package topology

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
    Session = sm.Session
    Topology = model.Topology
    User = model.User
    Network = model.Network
    VmResp = model.VmResp
)

var (
    sessionManager = globals.SessionManager
)

func get(c *gin.Context) {
    log.Println("In Topology GetAll")
    var err error
    var topology *Topology

    id, _ := strconv.Atoi(c.Param("id"))
    if topology, err = model.GetTopologyByID(uint(id)); err != nil {
        c.JSON(http.StatusNotFound, gin.H{
            "message": err.Error(),
        })
        return
    }

    c.JSON(http.StatusOK, gin.H{
        "message": "success",
        "users": topology,
    })
}

func create(c *gin.Context) {
    log.Println("In Topology Create")
    var topology Topology
    var err error
    var sess *Session

    if err := c.ShouldBindJSON(&topology); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{
            "message" : errors.New("Invalid request parameters"),
        })
        return
    }

    if sess = common.GetSession(c); sess == nil {
        c.JSON(http.StatusUnauthorized, gin.H{
            "message" : "Unauthorized",
        })
        return
    }

    topology.UserID = sess.Get("user_id").(int)

    if err = model.CreateTopology(topology); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{
            "message" : err.Error(),
        })
        return
    }

    c.JSON(http.StatusCreated, gin.H{
        "message": "success",
        "data":    topology.Serialize(),
    })
}

func update(c *gin.Context) {
    log.Println("In Topology Update")
    common.RespondNotImplemented(c)
}

func delete(c *gin.Context) {
    log.Println("In Topology Delete")
    common.RespondNotImplemented(c)
}

func getVms(c *gin.Context) {
    var err error
    var topology *Topology
    var vms []VmResp

    id, _ := strconv.Atoi(c.Param("id"))
    if topology, err = model.GetTopologyByID(uint(id)); err != nil {
        c.JSON(http.StatusNotFound, gin.H{
            "message": err.Error(),
        })
        return
    }

    if vms, err = topology.GetVms(); err != nil {
        c.JSON(http.StatusNotFound, gin.H{
            "message": err.Error(),
        })
        return
    }

    c.JSON(http.StatusOK, gin.H{
        "message": "success",
        "data": vms,
    })
}

func getNw(c *gin.Context) {
    var err error
    var topology *Topology
    var nws []Network

    id, _ := strconv.Atoi(c.Param("id"))
    if topology, err = model.GetTopologyByID(uint(id)); err != nil {
        c.JSON(http.StatusNotFound, gin.H{
            "message": err.Error(),
        })
        return
    }

    if nws, err = topology.GetNetworks(); err != nil {
        c.JSON(http.StatusNotFound, gin.H{
            "message": err.Error(),
        })
        return
    }

    c.JSON(http.StatusOK, gin.H{
        "message": "success",
        "data": nws,
    })
}
