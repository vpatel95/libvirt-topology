package model

import (
    "errors"

    valid "github.com/asaskevich/govalidator"
    "golang.org/x/crypto/bcrypt"

    "github.com/vpatel95/topology-deployer/database"
)

func hash(password string) (string, error) {
    bytes, err := bcrypt.GenerateFromPassword([]byte(password), 12)
    return string(bytes), err
}


func validateUser(u User, isCreate bool) error {
    var exists User
    db := database.DB

    if (valid.IsNull(u.Name) || valid.IsNull(u.Email) ||
            !valid.IsEmail(u.Email) || valid.IsNull(u.Username) ||
            !valid.IsAlphanumeric(u.Username)) {
        return errors.New("Invalid request parameters")
    }

    if (isCreate) {
        if (valid.IsNull(u.Password)) {
            return errors.New("Invalid request parameters")
        }

        if err := db.Where("email = ?", u.Email).First(&exists).Error; err == nil {
            return ErrEmailExists
        }

        if err := db.Where("username = ?", u.Username).First(&exists).Error; err == nil {
            return ErrUsernameExists
        }
    }

    return nil
}
