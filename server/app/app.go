package app

import (
    "fmt"
    "log"
    "net/http"

    "gorm.io/gorm"
    "gorm.io/driver/mysql"

    "github.com/vpatel95/topology-deployer/app/model"
    "github.com/vpatel95/topology-deployer/app/api/middleware"
    db "github.com/vpatel95/topology-deployer/database"
    "github.com/vpatel95/topology-deployer/route"
)

type App struct {
    Host string
    Port int
}

func Init(conf *db.DBConfig) {
    var err error

    dbURI := fmt.Sprintf("%s:%s@(%s:%d)/%s?charset=%s&parseTime=true&loc=Local",
        conf.Username, conf.Password,
        conf.Host, conf.Port,
        conf.Name, conf.Charset)

    db.DB, err = gorm.Open(mysql.Open(dbURI), &gorm.Config{})
    if err != nil {
        fmt.Println(err)
        log.Fatal("Failed to connect database")
    }

    db.DB = model.Migration(db.DB)
    route.InitRouter()
}

func (a *App) Run() {
    conf := db.GetConfig()
    Init(conf)

    appURI := fmt.Sprintf("%s:%d", a.Host, a.Port)

    http.Handle("/", route.Router)

    route.Router.Use(middleware.CORSMiddleware())

    log.Println("Starting server on : http://" + appURI)
    log.Fatal(route.Router.Run("0.0.0.0:5000"))
}
