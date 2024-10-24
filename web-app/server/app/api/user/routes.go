package user

import (
	"github.com/gin-gonic/gin"

	"github.com/vpatel95/topology-deployer/app/api/middleware"
)

func Routes(router *gin.RouterGroup) {
	routes := router.Group("/user")
	routes.Use(middleware.ValidateSessionID(),
		middleware.Authorization())

	routes.Use(middleware.IsSelfUser()).GET("/:id", get)
	routes.Use(middleware.IsSelfUser()).PUT("/:id", update)
	routes.Use(middleware.IsSelfUser()).DELETE("/:id", delete)
	routes.Use(middleware.IsSelfUser()).GET("/:id/topologies", getUserTopologies)
	routes.Use(middleware.IsSelfUser()).GET("/:id/networks", getUserNetworks)
	routes.Use(middleware.IsSelfUser()).GET("/:id/vms", getUserVms)
}
