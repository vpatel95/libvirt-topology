package route

import (
	"github.com/gin-gonic/gin"
	"github.com/vpatel95/topology-deployer/app/api"
	"github.com/vpatel95/topology-deployer/app/api/middleware"
)

var (
	Router *gin.Engine
)

func InitRouter() {
	Router = gin.Default()
	Router.Use(middleware.CORSMiddleware())

	api.GetRoutes(Router)
}
