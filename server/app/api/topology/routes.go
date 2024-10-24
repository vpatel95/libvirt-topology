package topology

import (
	"github.com/gin-gonic/gin"
	"github.com/vpatel95/topology-deployer/app/api/middleware"
)

func Routes(router *gin.RouterGroup) {
    routes := router.Group("/topology")
    routes.Use(middleware.ValidateSessionID(),
               middleware.Authorization())

    routes.POST("/create", create)
    routes.Use(middleware.IsUserTopology()).GET("/:id", get)
    routes.Use(middleware.IsUserTopology()).PUT("/:id", update)
    routes.Use(middleware.IsUserTopology()).DELETE("/:id", delete)
    routes.Use(middleware.IsUserTopology()).GET("/:id/vms", getVms)
    routes.Use(middleware.IsUserTopology()).GET("/:id/networks", getNw)
}
