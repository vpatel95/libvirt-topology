package auth

import (
	"github.com/gin-gonic/gin"
)

func Routes(router *gin.RouterGroup) {
	routes := router.Group("/auth")

	routes.POST("/login", login)
	routes.POST("/register", register)
}
