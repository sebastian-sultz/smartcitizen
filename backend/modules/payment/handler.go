package payment

import (
	"io"
	"net/http"

	dtorequest "backend/dto/request"
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

func (h *Handler) InitiatePayment(c *gin.Context) {
	var req dtorequest.InitiatePaymentRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var userID *uuid.UUID
	// Check if user is authenticated (Optional logic depending on project's auth middleware)
	if val, exists := c.Get("userID"); exists {
		if idStr, ok := val.(string); ok {
			if id, err := uuid.Parse(idStr); err == nil {
				userID = &id
			}
		}
	}

	resp, err := h.service.InitiatePayment(c.Request.Context(), req, userID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, resp)
}

func (h *Handler) HandleWebhook(c *gin.Context) {
	authHeader := c.GetHeader("Authorization")
	if authHeader == "" {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "missing authorization header"})
		return
	}

	body, err := io.ReadAll(c.Request.Body)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "failed to read body"})
		return
	}

	if err := h.service.HandleWebhook(c.Request.Context(), authHeader, body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"status": "success"})
}

func (h *Handler) CheckPaymentStatus(c *gin.Context) {
	transactionID := c.Param("transactionId")
	if transactionID == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "missing transactionId"})
		return
	}

	payment, err := h.service.CheckPaymentStatus(c.Request.Context(), transactionID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, payment)
}

func (h *Handler) GetPaymentHistory(c *gin.Context) {
	pagination := utils.GetPaginationFromContext(c)

	var userID *string
	// Optional filter by user
	if val, exists := c.Get("userID"); exists {
		if idStr, ok := val.(string); ok {
			userID = &idStr
		}
	}

	// Support admin queries
	if qUserID := c.Query("userId"); qUserID != "" {
		userID = &qUserID
	}

	payments, err := h.service.GetPaymentHistory(c.Request.Context(), userID, &pagination)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"data":       payments,
		"pagination": pagination,
	})
}

func (h *Handler) GetDonationStats(c *gin.Context) {
	userIDVal, exists := c.Get("userID")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
		return
	}
	userID, ok := userIDVal.(string)
	if !ok {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
		return
	}

	stats, err := h.service.GetUserDonationStats(c.Request.Context(), userID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, stats)
}

func (h *Handler) GetReceipt(c *gin.Context) {
	transactionID := c.Param("transactionId")
	if transactionID == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "missing transactionId"})
		return
	}

	url, err := h.service.GetReceiptURL(c.Request.Context(), transactionID)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "receipt not found or payment incomplete"})
		return
	}

	if url == "" {
		c.JSON(http.StatusAccepted, gin.H{"status": "processing"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"url": url})
}

func (h *Handler) GetTaxCertificates(c *gin.Context) {
	userIDVal, exists := c.Get("userID")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
		return
	}
	userID, ok := userIDVal.(string)
	if !ok {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
		return
	}

	certs, err := h.service.GetTaxCertificates(c.Request.Context(), userID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"certificates": certs})
}

func (h *Handler) UpdateTaxDetails(c *gin.Context) {
	transactionID := c.Param("transactionId")
	if transactionID == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "missing transactionId"})
		return
	}

	var req struct {
		DonorPAN     string `json:"donorPan" binding:"required"`
		DonorAddress string `json:"donorAddress" binding:"required"`
	}
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	err := h.service.UpdateTaxDetails(c.Request.Context(), transactionID, req.DonorPAN, req.DonorAddress)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"status": "success"})
}
