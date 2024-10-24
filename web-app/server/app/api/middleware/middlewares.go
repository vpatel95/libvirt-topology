package middleware

import (
	"errors"
	"io/ioutil"
	"log"
	"net/http"
	"strconv"

	jwt "github.com/dgrijalva/jwt-go"
	"github.com/gin-gonic/gin"

	sm "github.com/vpatel95/session-manager"
	"github.com/vpatel95/topology-deployer/app/lib/common"
	"github.com/vpatel95/topology-deployer/app/model"
	"github.com/vpatel95/topology-deployer/database"
	"github.com/vpatel95/topology-deployer/env"
	"github.com/vpatel95/topology-deployer/globals"
)

type (
	Session        = sm.Session
	JSON           = map[string]interface{}
	User           = model.User
	Topology       = model.Topology
	Network        = model.Network
	VirtualMachine = model.VirtualMachine
)

var (
	secretKey      []byte
	sessionManager = globals.SessionManager
)

func init() {
	key, err := ioutil.ReadFile(env.JWTSecret)
	if err != nil {
		log.Fatal("Failed to load JWT Secret key from " + env.JWTSecret)
	}

	secretKey = key
}

func getTokenData(tokenStr string) (JSON, error) {
	token, err := jwt.Parse(tokenStr, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, errors.New("Unexpected token signing method")
		}

		return secretKey, nil
	})

	if err != nil {
		return JSON{}, err
	}

	if !token.Valid {
		return JSON{}, errors.New("Invalid token")
	}

	return token.Claims.(jwt.MapClaims), nil
}

func ValidateSessionID() gin.HandlerFunc {
	log.Println("In validateToken Middleware")
	return func(c *gin.Context) {
		sid, err := sessionManager.GetSessionId(c.Request)
		if err != nil {
			log.Println("[ValidateSessionID] ::: Failed to get token : " + err.Error())
			c.AbortWithStatusJSON(http.StatusUnauthorized, JSON{
				"status": "failure",
				"data":   "Unauthorized",
			})
			return
		}

		data, err := getTokenData(sid)
		if err != nil {
			log.Println("data : " + err.Error())
			c.AbortWithStatusJSON(http.StatusUnauthorized, JSON{
				"status": "failure",
				"data":   "Unauthorized",
			})
			return
		}

		if _, ok := data["user"]; !ok {
			log.Println("key user not found")
			c.AbortWithStatusJSON(http.StatusUnauthorized, JSON{
				"status": "failure",
				"data":   "Unauthorized",
			})
			return
		}

		var user User
		user.Load(data["user"].(JSON))

		sess, err := sessionManager.SessionReadOrCreate(c.Request)
		if err != nil {
			log.Println("[ValidateSessionID] ::: Failed to get session : " + err.Error())
			c.AbortWithStatusJSON(http.StatusUnauthorized, JSON{
				"status": "failure",
				"data":   "Unauthorized",
			})
			return
		}

		sess.Set("user_id", int(user.ID))

		c.Next()
	}
}

func Authorization() gin.HandlerFunc {
	log.Println("In Authorization")
	return func(c *gin.Context) {
		sessionManager.ListSessions()
		sess, err := sessionManager.SessionRead(c.Request)
		if err != nil {
			log.Println("get sess : " + err.Error())
			c.AbortWithStatusJSON(http.StatusUnauthorized, JSON{
				"status": "failure",
				"data":   "Unauthorized",
			})
			return
		}

		if ok := sess.Exist("user_id"); !ok {
			log.Println("user exist : " + err.Error())
			c.AbortWithStatusJSON(http.StatusUnauthorized, JSON{
				"status": "failure",
				"data":   "Unauthorized",
			})
			return
		}

		c.Set("session", sess)
		c.Next()
	}
}

func IsSelfUser() gin.HandlerFunc {
	return func(c *gin.Context) {
		var currUserID int
		var sess *Session
		if sess = common.GetSession(c); sess == nil {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{
				"status": "failure",
				"data":   "Unauthorized",
			})
			return
		}

		id, _ := strconv.Atoi(c.Param("id"))
		currUserID = sess.Get("user_id").(int)
		if currUserID != id {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{
				"status": "failure",
				"data":   "Unauthorized",
			})
			return
		}
		c.Next()
	}
}

func IsUserTopology() gin.HandlerFunc {
	return func(c *gin.Context) {
		var currUserID int
		var sess *Session
		var topology Topology
		if sess = common.GetSession(c); sess == nil {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{
				"status": "failure",
				"data":   "Unauthorized",
			})
			return
		}

		id, _ := strconv.Atoi(c.Param("id"))
		currUserID = sess.Get("user_id").(int)

		db := database.DB
		err := db.First(&topology, id).Error
		if err != nil {
			c.AbortWithStatusJSON(http.StatusNotFound, gin.H{
				"status": "failure",
				"data":   "Topology not found",
			})
			return
		}

		if currUserID != topology.UserID {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{
				"status": "failure",
				"data":   "Unauthorized",
			})
			return
		}
		c.Next()
	}
}

func IsUserVm() gin.HandlerFunc {
	return func(c *gin.Context) {
		var currUserID int
		var sess *Session
		if sess = common.GetSession(c); sess == nil {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{
				"status": "failure",
				"data":   "Unauthorized",
			})
			return
		}

		id, _ := strconv.Atoi(c.Param("id"))
		currUserID = sess.Get("user_id").(int)

		db := database.DB
		err := db.First(&VirtualMachine{}, "id = ? AND user_id = ?", id, currUserID).Error
		if err != nil {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{
				"status": "failure",
				"data":   "Unauthorized",
			})
			return
		}

		if currUserID != id {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{
				"status": "failure",
				"data":   "Unauthorized",
			})
			return
		}
		c.Next()
	}
}

func IsUserNw() gin.HandlerFunc {
	return func(c *gin.Context) {
		var currUserID int
		var sess *Session
		if sess = common.GetSession(c); sess == nil {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{
				"status": "failure",
				"data":   "Unauthorized",
			})
			return
		}

		id, _ := strconv.Atoi(c.Param("id"))
		currUserID = sess.Get("user_id").(int)

		db := database.DB
		err := db.First(&Network{}, "id = ? AND user_id = ?", id, currUserID).Error
		if err != nil {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{
				"status": "failure",
				"data":   "Unauthorized",
			})
			return
		}

		if currUserID != id {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{
				"status": "failure",
				"data":   "Unauthorized",
			})
			return
		}
		c.Next()
	}
}

func CORSMiddleware() gin.HandlerFunc {
	log.Println("In enable CORS Middleware")
	return func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", "http://10.87.1.25:3000")
		c.Writer.Header().Set("Access-Control-Allow-Credentials", "true")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		// c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Origin, Accept")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization, accept, origin, Cache-Control, X-Requested-With")

		if c.Request.Method == http.MethodOptions {
			c.AbortWithStatus(http.StatusOK)
			return
		}

		c.Next()
	}
}
