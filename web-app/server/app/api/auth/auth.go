package auth

import (
	"errors"
	"log"
	"net/http"
	"time"

	valid "github.com/asaskevich/govalidator"
	"github.com/gin-gonic/gin"

	"github.com/vpatel95/topology-deployer/app/model"
	"github.com/vpatel95/topology-deployer/database"
	"github.com/vpatel95/topology-deployer/globals"
)

type (
	JSON    = map[string]interface{}
	User    = model.User
	LoginRB = model.LoginRB
)

var (
	sm = globals.SessionManager
)

func register(c *gin.Context) {
	var user User
	var err error

	if err := c.ShouldBindJSON(&user); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": errors.New("Invalid request parameters"),
		})
		return
	}

	if err = model.CreateUser(user); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": err.Error(),
		})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"message": "success",
		"data":    user.Serialize(),
	})
}

func login(c *gin.Context) {

	var user User
	var body LoginRB

	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": errors.New("Invalid request parameters"),
		})
		return
	}

	if valid.IsNull(body.Username) && valid.IsNull(body.Password) {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": errors.New("Invalid request parameters"),
		})
		return
	}

	db := database.DB
	if err := db.Where("username = ?", body.Username).First(&user).Error; err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{
			"message": "Internal server error",
		})
		return
	}

	if !matchHash(body.Password, user.Password) {
		c.JSON(http.StatusUnauthorized, gin.H{
			"message": "Invalid username or password",
		})
		return
	}

	sid, _ := generateSid(user.Serialize())

	log.Println("set sid : " + sid)

	// Use Authorization Header instead of Cookie
	sm.Config.EnableHttpHeader = true
	sm.Config.SessionHeader = "Authorization"
	sm.Config.MaxLifetime = 30 * time.Second
	sm.Config.CleanerInterval = 1 * time.Second

	// c.SetCookie(sm.Cookie.Name, sid,
	// 	int(sm.Config.MaxLifetime.Seconds()), "/", "", false, true)

	c.JSON(http.StatusCreated, gin.H{
		"message": "success",
		"user":    user.Serialize(),
		"token":   sid,
	})
}
