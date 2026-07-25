package middleware

import (
	"net/http"
	"sync"
	"time"

	"github.com/gin-gonic/gin"
)

type clientVisitor struct {
	lastSeen time.Time
	tokens   float64
}

// IPRateLimiter tracks request rate per IP using a Token Bucket algorithm
type IPRateLimiter struct {
	mu         sync.RWMutex
	visitors   map[string]*clientVisitor
	rate       float64 // tokens per second
	burst      float64 // max token capacity
	cleanupDur time.Duration
}

// NewIPRateLimiter creates a thread-safe rate limiter.
// ratePerMin: maximum allowed requests per minute.
// burst: maximum burst capacity allowed.
func NewIPRateLimiter(ratePerMin float64, burst float64) *IPRateLimiter {
	limiter := &IPRateLimiter{
		visitors:   make(map[string]*clientVisitor),
		rate:       ratePerMin / 60.0,
		burst:      burst,
		cleanupDur: 3 * time.Minute,
	}

	// Periodically clean up stale client IPs to prevent memory leaks
	go limiter.cleanupStaleVisitors()

	return limiter
}

func (l *IPRateLimiter) allow(ip string) bool {
	l.mu.Lock()
	defer l.mu.Unlock()

	now := time.Now()
	v, exists := l.visitors[ip]
	if !exists {
		l.visitors[ip] = &clientVisitor{
			lastSeen: now,
			tokens:   l.burst - 1.0, // consume 1 token for current request
		}
		return true
	}

	// Replenish tokens based on elapsed time
	elapsed := now.Sub(v.lastSeen).Seconds()
	v.tokens += elapsed * l.rate
	if v.tokens > l.burst {
		v.tokens = l.burst
	}
	v.lastSeen = now

	if v.tokens >= 1.0 {
		v.tokens -= 1.0
		return true
	}

	return false
}

func (l *IPRateLimiter) cleanupStaleVisitors() {
	for {
		time.Sleep(l.cleanupDur)
		l.mu.Lock()
		now := time.Now()
		for ip, v := range l.visitors {
			if now.Sub(v.lastSeen) > 5*time.Minute {
				delete(l.visitors, ip)
			}
		}
		l.mu.Unlock()
	}
}

// RateLimitMiddleware creates a Gin middleware to rate limit requests.
func RateLimitMiddleware(requestsPerMinute float64, burst float64) gin.HandlerFunc {
	limiter := NewIPRateLimiter(requestsPerMinute, burst)

	return func(c *gin.Context) {
		ip := c.ClientIP()
		if !limiter.allow(ip) {
			c.Header("Retry-After", "60")
			c.JSON(http.StatusTooManyRequests, gin.H{
				"error": "Too many requests. Please slow down and try again later.",
			})
			c.Abort()
			return
		}
		c.Next()
	}
}
