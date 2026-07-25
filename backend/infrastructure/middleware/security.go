package middleware

import (
	"os"

	"github.com/gin-gonic/gin"
)

// SecurityHeadersMiddleware attaches HTTP security headers to all incoming API responses.
func SecurityHeadersMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Header("X-Content-Type-Options", "nosniff")
		c.Header("X-Frame-Options", "DENY")
		c.Header("X-XSS-Protection", "1; mode=block")
		c.Header("Referrer-Policy", "strict-origin-when-cross-origin")

		isProduction := os.Getenv("APP_ENV") == "production" || os.Getenv("GIN_MODE") == "release"
		if isProduction {
			c.Header("Strict-Transport-Security", "max-age=31536000; includeSubDomains")
		}

		c.Next()
	}
}
