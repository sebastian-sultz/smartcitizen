package utils

import (
	"errors"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

// GetUserIDFromContext retrieves the userID from the Gin context, handling
// both raw uuid.UUID types and serialized string types.
func GetUserIDFromContext(c *gin.Context) (uuid.UUID, error) {
	val, exists := c.Get("userID")
	if !exists {
		return uuid.Nil, errors.New("userID not found in context")
	}

	// If it's already a uuid.UUID, return it directly (O(1))
	if id, ok := val.(uuid.UUID); ok {
		return id, nil
	}

	// If it's a string, parse it into uuid.UUID
	if idStr, ok := val.(string); ok {
		id, err := uuid.Parse(idStr)
		if err != nil {
			return uuid.Nil, errors.New("invalid userID UUID format in context")
		}
		return id, nil
	}

	return uuid.Nil, errors.New("invalid userID type in context")
}
