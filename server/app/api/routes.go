package api

import (
    "github.com/gin-gonic/gin"
    "github.com/vpatel95/topology-deployer/app/api/auth"
    "github.com/vpatel95/topology-deployer/app/api/user"
    "github.com/vpatel95/topology-deployer/app/api/topology"
    "github.com/vpatel95/topology-deployer/app/api/vm"
    "github.com/vpatel95/topology-deployer/app/api/network"
)

func GetRoutes(router *gin.Engine) {
    routes := router.Group("/api")

    auth.Routes(routes)
    user.Routes(routes)
    topology.Routes(routes)
    network.Routes(routes)
    vm.Routes(routes)
}
