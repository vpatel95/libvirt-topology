package common

import (
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	sm "github.com/vpatel95/session-manager"
)

type (
	Session = sm.Session
)

// Response Helper Functions

// Send a JSON Response
func RespondJSON(c *gin.Context, status int, payload gin.H) {
	c.JSON(status, payload)
}

// Error response wrapper for JSON Response
func RespondError(c *gin.Context, status int, message string) {
	RespondJSON(c, status, gin.H{"message": message})
}

// Not Implemented response wrapper for JSON Response
func RespondNotImplemented(c *gin.Context) {
	RespondJSON(c, http.StatusInternalServerError, gin.H{"message": "Not yet implemented"})
}

// Set Cookie in HTTP Response
func SetCookie(w http.ResponseWriter, name string, value string) {
	expire := time.Now().Add(24 * 60 * time.Second)
	cookie := http.Cookie{
		Name:    name,
		Value:   value,
		Expires: expire,
	}
	http.SetCookie(w, &cookie)
}

func GetSession(c *gin.Context) *Session {
	if session, ok := c.Get("session"); ok {
		return session.(*Session)
	}

	return nil
}
