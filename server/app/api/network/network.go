package network

import (
	"errors"
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
	sm "github.com/vpatel95/session-manager"

	"github.com/vpatel95/topology-deployer/app/lib/common"
	"github.com/vpatel95/topology-deployer/app/model"
	"github.com/vpatel95/topology-deployer/globals"
)

type (
    Session = sm.Session
    Network = model.Network
    NetworkType = model.NetworkType
)

var (
    sessionManager = globals.SessionManager
)

func index(c *gin.Context) {
    log.Println("In Network Get")
    common.RespondNotImplemented(c)
}

func get(c *gin.Context) {
    log.Println("In Network GetAll")
    common.RespondNotImplemented(c)
}

func create(c *gin.Context) {
    var nw Network
    var err error
    var sess *Session

    if err = c.ShouldBindJSON(&nw); err != nil {
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

    nw.UserID = sess.Get("user_id").(int)

    if err = model.CreateNetwork(nw); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{
            "message" : err.Error(),
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
