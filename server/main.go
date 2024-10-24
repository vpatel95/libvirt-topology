package main

import (
    "github.com/vpatel95/topology-deployer/app"
)

func main() {

    app := &app.App{
        Host: "0.0.0.0",
        Port: 5000,
    }

    app.Run()
}
