package user

import (
	"net/http"
	"os"

	"backend/dto/request"
	"backend/dto/response"
	"backend/pkg/cloudinary"
	"backend/pkg/jwt"
	"github.com/gin-gonic/gin"
)

type Handler struct {
	service Service
}

func NewHandler(service Service) *Handler {
	return &Handler{service: service}
}

func (h *Handler) RegisterRoutes(router *gin.RouterGroup) {
	auth := router.Group("/auth")
	{
		auth.POST("/register", h.Register)
		auth.POST("/login", h.Login)
		auth.POST("/forget-password", h.ForgetPassword)
		auth.PUT("/profile-photo/:id", h.UpdateProfilePhoto)
	}
}

func mapToResponse(u *User) response.User {
	return response.User{
		ID:                   u.ID,
		Name:                 u.Name,
		Phone:                u.Phone,
		ProfilePhoto:         u.ProfilePhoto,
		UserType:             string(u.UserType),
		TotalPayments:        u.TotalPayments,
		TotalAmount:          u.TotalAmount,
		ReferralPaymentCount: u.ReferralPaymentCount,
		ReferralID:           u.ReferralID,
		CreatedAt:            u.CreatedAt,
		UpdatedAt:            u.UpdatedAt,
	}
}

func (h *Handler) Register(c *gin.Context) {
	var req request.RegisterUser
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	user, err := h.service.Register(&req)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	secret := os.Getenv("JWT_SECRET")
	if secret == "" {
		secret = "supersecret"
	}
	accessToken, refreshToken, err := jwt.GenerateTokens(user.ID, string(user.UserType), secret)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to generate tokens"})
		return
	}

	c.SetCookie("access_token", accessToken, 15*60, "/", "", false, true)
	c.SetCookie("refresh_token", refreshToken, 7*24*60*60, "/", "", false, true)

	c.JSON(http.StatusCreated, gin.H{"message": "registered successfully", "user": mapToResponse(user)})
}

func (h *Handler) Login(c *gin.Context) {
	var req request.LoginUser
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	user, err := h.service.Login(&req)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": err.Error()})
		return
	}

	secret := os.Getenv("JWT_SECRET")
	if secret == "" {
		secret = "supersecret"
	}
	accessToken, refreshToken, err := jwt.GenerateTokens(user.ID, string(user.UserType), secret)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to generate tokens"})
		return
	}

	c.SetCookie("access_token", accessToken, 15*60, "/", "", false, true)
	c.SetCookie("refresh_token", refreshToken, 7*24*60*60, "/", "", false, true)

	c.JSON(http.StatusOK, gin.H{"message": "logged in successfully", "user": mapToResponse(user)})
}

func (h *Handler) ForgetPassword(c *gin.Context) {
	var req request.ForgetPassword
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	err := h.service.ForgetPassword(&req)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "password updated successfully"})
}

func (h *Handler) UpdateProfilePhoto(c *gin.Context) {
	id := c.Param("id")
	if id == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "user id is required"})
		return
	}

	file, _, err := c.Request.FormFile("profile_photo")
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "profile_photo file is required"})
		return
	}
	defer file.Close()

	// Need context for cloudinary
	url, publicID, err := cloudinary.UploadImage(c.Request.Context(), file, "smartcitizen/profiles")
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to upload image"})
		return
	}

	// Update user in DB
	err = h.service.UpdateProfilePhoto(c.Request.Context(), id, url, publicID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "profile photo updated successfully",
		"url": url,
	})
}
