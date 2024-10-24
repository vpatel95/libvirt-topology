package globals

import (
	"time"

	sm "github.com/vpatel95/session-manager"
)

var (
	SessionManager = sm.New(sm.SessionManagerConfig{
		CleanerInterval:    30 * time.Second,
		MaxLifetime:        1 * time.Hour,
		EnableHttpHeader:   true,
		SessionHeader:      "Authorization",
		AutoRefreshSession: false,
	})
)
