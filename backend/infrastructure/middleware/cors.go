package middleware

import (
	"os"
	"strings"
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

// CORSMiddleware handles Cross-Origin Resource Sharing (CORS) configuration.
func CORSMiddleware() gin.HandlerFunc {
	return cors.New(cors.Config{
		AllowOriginFunc: func(origin string) bool {
			if origin == "" {
				return true
			}

			// Clean incoming origin (remove trailing slashes and spaces)
			cleanedOrigin := strings.TrimRight(strings.TrimSpace(origin), "/")

			// Read allowed origins from env (FRONTEND_URL and/or ALLOWED_ORIGINS)
			allowedOriginsMap := make(map[string]bool)

			frontendURL := strings.TrimSpace(os.Getenv("FRONTEND_URL"))
			if frontendURL != "" {
				allowedOriginsMap[strings.TrimRight(frontendURL, "/")] = true
			}

			allowedOriginsStr := os.Getenv("ALLOWED_ORIGINS")
			if allowedOriginsStr != "" {
				origins := strings.Split(allowedOriginsStr, ",")
				for _, o := range origins {
					cleaned := strings.TrimRight(strings.TrimSpace(o), "/")
					if cleaned != "" {
						allowedOriginsMap[cleaned] = true
					}
				}
			}

			isProduction := os.Getenv("APP_ENV") == "production" || os.Getenv("GIN_MODE") == "release"

			// If configured origins match
			if allowedOriginsMap[cleanedOrigin] || allowedOriginsMap["*"] {
				return true
			}

			if !isProduction {
				// Allow default local frontend environments in development mode
				if len(allowedOriginsMap) == 0 ||
					strings.HasPrefix(cleanedOrigin, "http://localhost:") ||
					strings.HasPrefix(cleanedOrigin, "http://127.0.0.1:") ||
					strings.HasPrefix(cleanedOrigin, "https://localhost:") {
					return true
				}
			}

			return false
		},
		AllowMethods: []string{"GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"},
		AllowHeaders: []string{
			"Origin",
			"Content-Type",
			"Content-Length",
			"Accept-Encoding",
			"X-CSRF-Token",
			"Authorization",
			"Accept",
			"Cache-Control",
			"X-Requested-With",
			"Token",
			"Cookie",
		},
		ExposeHeaders:    []string{"Content-Length", "Set-Cookie"},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
	})
}

