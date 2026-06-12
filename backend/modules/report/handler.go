package report

import (
	"net/http"

	"backend/dto/request"
	"backend/modules/user"
	"backend/pkg/utils"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

type Handler struct {
	service Service
}

func NewHandler(service Service) *Handler {
	return &Handler{service: service}
}

// helper to extract and handle userID context failures in reports handler
func getAuthenticatedUserID(c *gin.Context) (uuid.UUID, bool) {
	userID, err := utils.GetUserIDFromContext(c)
	if err != nil {
		// If error is due to missing userID, return 401 Unauthorized, otherwise return 500
		if err.Error() == "userID not found in context" {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
		} else {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		}
		return uuid.Nil, false
	}
	return userID, true
}

func (h *Handler) CreateReport(c *gin.Context) {
	var req request.CreateReportReq
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	userID, ok := getAuthenticatedUserID(c)
	if !ok {
		return
	}

	report, err := h.service.CreateReport(userID, req.Title, req.Description)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"message": "report created successfully", "report": report})
}

func (h *Handler) GetReports(c *gin.Context) {
	// Check if user is admin
	userType, exists := c.Get("userType")
	if !exists || userType != string(user.Admin) {
		c.JSON(http.StatusForbidden, gin.H{"error": "forbidden, admin access required"})
		return
	}

	status := c.Query("status")
	reports, err := h.service.GetReports(status)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to fetch reports"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"reports": reports})
}

func (h *Handler) ResolveReport(c *gin.Context) {
	// Check if user is admin
	userType, exists := c.Get("userType")
	if !exists || userType != string(user.Admin) {
		c.JSON(http.StatusForbidden, gin.H{"error": "forbidden, admin access required"})
		return
	}

	id := c.Param("id")
	if id == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "report id is required"})
		return
	}

	var req request.ResolveReportReq
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	adminID, ok := getAuthenticatedUserID(c)
	if !ok {
		return
	}

	report, err := h.service.ResolveReport(id, req.ActionTaken, adminID)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "report resolved successfully", "report": report})
}

func (h *Handler) GetReport(c *gin.Context) {
	id := c.Param("id")
	userID, ok := getAuthenticatedUserID(c)
	if !ok {
		return
	}
	userType, _ := c.Get("userType")
	isAdmin := userType == string(user.Admin)

	report, err := h.service.GetReportByID(id, userID, isAdmin)
	if err != nil {
		c.JSON(http.StatusForbidden, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"report": report})
}

func (h *Handler) AddMessage(c *gin.Context) {
	id := c.Param("id")
	userID, ok := getAuthenticatedUserID(c)
	if !ok {
		return
	}
	userType, _ := c.Get("userType")
	isAdmin := userType == string(user.Admin)

	var req request.AddMessageReq
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	msg, err := h.service.AddMessage(id, userID, req.Message, isAdmin)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"message": "message added", "data": msg})
}

func (h *Handler) GetMessages(c *gin.Context) {
	id := c.Param("id")
	userID, ok := getAuthenticatedUserID(c)
	if !ok {
		return
	}
	userType, _ := c.Get("userType")
	isAdmin := userType == string(user.Admin)

	messages, err := h.service.GetMessages(id, userID, isAdmin)
	if err != nil {
		c.JSON(http.StatusForbidden, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"messages": messages})
}

func (h *Handler) GetUserReports(c *gin.Context) {
	userID, ok := getAuthenticatedUserID(c)
	if !ok {
		return
	}

	status := c.Query("status")
	reports, err := h.service.GetReportsByReporterID(userID, status)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to fetch reports"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"reports": reports})
}
