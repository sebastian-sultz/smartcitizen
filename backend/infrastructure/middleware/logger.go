package middleware

import (
	"bytes"
	"io"
	"log"
	"time"

	"github.com/gin-gonic/gin"
)

type responseBodyWriter struct {
	gin.ResponseWriter
	body *bytes.Buffer
}

func (r responseBodyWriter) Write(b []byte) (int, error) {
	r.body.Write(b)
	return r.ResponseWriter.Write(b)
}

func GlobalLogger() gin.HandlerFunc {
	return func(c *gin.Context) {
		start := time.Now()
		
		// Log the incoming request method and path
		log.Printf("[GLOBAL] Incoming %s request to %s", c.Request.Method, c.Request.URL.Path)

		// Read body (for logging)
		var requestBody []byte
		if c.Request.Body != nil {
			requestBody, _ = io.ReadAll(c.Request.Body)
			c.Request.Body = io.NopCloser(bytes.NewBuffer(requestBody))
		}

		// Prepare to capture response body
		w := &responseBodyWriter{body: &bytes.Buffer{}, ResponseWriter: c.Writer}
		c.Writer = w

		// Process request
		c.Next()

		latency := time.Since(start)
		statusCode := c.Writer.Status()

		if statusCode >= 400 {
			log.Printf("[BUG TRACKING] HTTP %d | Method: %s | Path: %s | Latency: %s\nReq Body: %s\nResp Body: %s",
				statusCode,
				c.Request.Method,
				c.Request.URL.Path,
				latency,
				string(requestBody),
				w.body.String(),
			)
		} else {
			log.Printf("[GLOBAL] Completed %s %s with status %d in %v", c.Request.Method, c.Request.URL.Path, statusCode, latency)
		}
		
		// If there are errors attached to the Gin context, log them
		if len(c.Errors) > 0 {
			log.Printf("[GLOBAL] Errors: %v", c.Errors.String())
		}
	}
}
