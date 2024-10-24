package auth

import (
	"io/ioutil"
	"log"
	"path/filepath"
	"time"

	jwt "github.com/dgrijalva/jwt-go"
	"golang.org/x/crypto/bcrypt"

	"github.com/vpatel95/topology-deployer/env"
)

func matchHash(password string, hash string) bool {
	err := bcrypt.CompareHashAndPassword([]byte(hash), []byte(password))
	return err == nil
}

func generateToken(data JSON) (string, error) {

	sid := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"user": data,
		"time": time.Now(),
	})

	keyPath := filepath.Join(env.JWTSecret)

	key, err := ioutil.ReadFile(keyPath)
	if err != nil {
		log.Println("[generateToken} ::: Key file read error = " + err.Error())
		return "", err
	}

	sidStr, err := sid.SignedString(key)
	if err != nil {
		log.Println("[generateToken] ::: Session ID string error = " + err.Error())
	}

	return sidStr, err
}
