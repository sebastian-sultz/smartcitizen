package report

import (
	"net/http"

	"backend/dto/request"
	"backend/modules/user"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

type Handler struct {
	service Service
}

func NewHandler(service Service) *Handler {
	return &Handler{service: service}
}

func (h *Handler) CreateReport(c *gin.Context) {
	var req request.CreateReportReq
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	userIDRaw, exists := c.Get("userID")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
		return
	}

	userID, ok := userIDRaw.(uuid.UUID)
	if !ok {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "invalid user ID type in context"})
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

	userIDRaw, exists := c.Get("userID")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
		return
	}
	adminID, ok := userIDRaw.(uuid.UUID)
	if !ok {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "invalid user ID type in context"})
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
	userIDRaw, exists := c.Get("userID")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
		return
	}
	userID := userIDRaw.(uuid.UUID)
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
	userIDRaw, exists := c.Get("userID")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
		return
	}
	userID := userIDRaw.(uuid.UUID)
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
	userIDRaw, exists := c.Get("userID")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
		return
	}
	userID := userIDRaw.(uuid.UUID)
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
	userIDRaw, exists := c.Get("userID")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
		return
	}

	userID, ok := userIDRaw.(uuid.UUID)
	if !ok {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "invalid user ID type in context"})
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


Smart Citizen ID Generation: The unique GSCXXXXXX ID sequence is missing from the backend user schema.
the slug thing


Contact Enquiry Form	Section 8 / 22	Missing	Mocked UI	Frontend landing page contact form doesn't connect to any endpoint.

http://localhost:3000/api/reports
 this api is giving 500 error


 there is some eror in uuid and uuid.string and userid thing. letter cases and check all the inconsistencies.