package globals

import (
	"time"

	sm "github.com/vpatel95/session-manager"
)

var (
	SessionManager = sm.New(sm.SessionManagerConfig{
		CleanerInterval:    1 * time.Second,
		MaxLifetime:        15 * time.Second,
		EnableHttpHeader:   true,
		SessionHeader:      "Authorization",
		AutoRefreshSession: false,
	})
)
