package payment

import (
	"fmt"
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

	var filter dtorequest.PaymentFilter

	userTypeVal, exists := c.Get("userType")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
		return
	}
	userType, ok := userTypeVal.(string)
	if !ok {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
		return
	}

	userIDVal, exists := c.Get("userID")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
		return
	}
	userIDStr, ok := userIDVal.(string)
	if !ok {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
		return
	}

	if userType == "admin" {
		// Admin can view globally or filter by specific user
		if qUserID := c.Query("userId"); qUserID != "" {
			filter.UserID = &qUserID
		}
		// Admin search & filters
		if search := c.Query("search"); search != "" {
			filter.Search = &search
		}
		if status := c.Query("status"); status != "" {
			filter.Status = &status
		}
		if taxExempt := c.Query("taxExemption"); taxExempt != "" {
			val := taxExempt == "true"
			filter.TaxExemption = &val
		}
		if start := c.Query("startDate"); start != "" {
			filter.StartDate = &start
		}
		if end := c.Query("endDate"); end != "" {
			filter.EndDate = &end
		}
		if sortBy := c.Query("sortBy"); sortBy != "" {
			filter.SortBy = &sortBy
		}
		if sortOrder := c.Query("sortOrder"); sortOrder != "" {
			filter.SortOrder = &sortOrder
		}
	} else {
		// Non-admin can only view their own payment history
		filter.UserID = &userIDStr
	}

	payments, err := h.service.GetPaymentHistory(c.Request.Context(), filter, &pagination)
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

func (h *Handler) ExportCSV(c *gin.Context) {
	var filter dtorequest.PaymentFilter

	if search := c.Query("search"); search != "" {
		filter.Search = &search
	}
	if status := c.Query("status"); status != "" {
		filter.Status = &status
	}
	if taxExempt := c.Query("taxExemption"); taxExempt != "" {
		val := taxExempt == "true"
		filter.TaxExemption = &val
	}
	if start := c.Query("startDate"); start != "" {
		filter.StartDate = &start
	}
	if end := c.Query("endDate"); end != "" {
		filter.EndDate = &end
	}

	c.Header("Content-Description", "File Transfer")
	c.Header("Content-Disposition", "attachment; filename=payments_export.csv")
	c.Header("Content-Type", "text/csv")
	c.Header("Content-Transfer-Encoding", "binary")

	if err := h.service.ExportPaymentsCSV(c.Request.Context(), filter, c.Writer); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
}

func (h *Handler) Export10BD(c *gin.Context) {
	financialYear := c.Query("financialYear")
	if financialYear == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "missing financialYear parameter"})
		return
	}

	filename := fmt.Sprintf("form_10bd_%s.csv", financialYear)
	c.Header("Content-Description", "File Transfer")
	c.Header("Content-Disposition", fmt.Sprintf("attachment; filename=%s", filename))
	c.Header("Content-Type", "text/csv")
	c.Header("Content-Transfer-Encoding", "binary")

	if err := h.service.ExportForm10BDCSV(c.Request.Context(), financialYear, c.Writer); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
}

func (h *Handler) SyncPendingReceipts(c *gin.Context) {
	count, err := h.service.SyncPendingReceipts(c.Request.Context())
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"status":  "success",
		"message": fmt.Sprintf("Synchronized %d pending receipts in the background.", count),
		"count":   count,
	})
}

