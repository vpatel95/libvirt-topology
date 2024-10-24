package network

import (
	"github.com/gin-gonic/gin"

	"github.com/vpatel95/topology-deployer/app/api/middleware"
)

func Routes(router *gin.RouterGroup) {
	routes := router.Group("/network")
	routes.Use(middleware.ValidateSessionID(),
		middleware.Authorization())

	routes.GET("/:id", get)
	routes.GET(":id/attached_vms", attachedVms)
	routes.POST("/create", create)
	routes.PUT("/:id", update)
	routes.DELETE("/:id", delete)
}
