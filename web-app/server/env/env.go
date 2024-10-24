package env

import (
	"os"
	"path/filepath"
)

var (
	ProjectRoot, _ = os.Getwd()
	ConfigRoot     = filepath.Join(ProjectRoot, "configs")
	DBConfig       = filepath.Join(ConfigRoot, "database.json")
	JWTSecret      = filepath.Join(ConfigRoot, "jwtsecret.key")
)
