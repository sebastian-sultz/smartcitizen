package user

import (
	"fmt"
	"net/http"
	"os"

	"backend/dto/request"
	"backend/dto/response"
	"backend/pkg/cloudinary"
	"backend/pkg/jwt"
	"backend/pkg/utils"

	"github.com/gin-gonic/gin"
)

type Handler struct {
	service Service
}

func NewHandler(service Service) *Handler {
	return &Handler{service: service}
}



func mapToResponse(u *User, refName *string, vol *response.Volunteer) response.User {
	return response.User{
		ID:                    u.ID,
		Name:                  u.Name,
		Phone:                 u.Phone,
		ProfilePhoto:          u.ProfilePhoto,
		UserType:              string(u.UserType),
		TotalPayments:         u.TotalPayments,
		TotalAmount:           u.TotalAmount,
		ReferralPaymentCount:  u.ReferralPaymentCount,
		ReferralPaymentAmount: u.ReferralPaymentAmount,
		TotalReferrals:        u.TotalReferrals,
		TotalEventsRegistered: u.TotalEventsRegistered,
		ReferralID:            u.ReferralID,
		ReferralName:          refName,
		IsSuspended:           u.IsSuspended,
		Volunteer:             vol,
		CreatedAt:             u.CreatedAt,
		UpdatedAt:             u.UpdatedAt,
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

	c.JSON(http.StatusCreated, gin.H{"message": "registered successfully", "user": mapToResponse(user, nil, nil)})
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

	c.JSON(http.StatusOK, gin.H{"message": "logged in successfully", "user": mapToResponse(user, nil, nil)})
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
		"url":     url,
	})
}

func (h *Handler) Refresh(c *gin.Context) {
	refreshToken, err := c.Cookie("refresh_token")
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "refresh token missing"})
		return
	}

	secret := os.Getenv("JWT_SECRET")
	if secret == "" {
		secret = "supersecret"
	}

	claims, err := jwt.ParseToken(refreshToken, secret)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "invalid refresh token"})
		return
	}

	accessToken, newRefreshToken, err := jwt.GenerateTokens(claims.UserID, claims.UserType, secret)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to generate tokens"})
		return
	}

	c.SetCookie("access_token", accessToken, 15*60, "/", "", false, true)
	c.SetCookie("refresh_token", newRefreshToken, 7*24*60*60, "/", "", false, true)

	c.JSON(http.StatusOK, gin.H{"message": "token refreshed successfully"})
}

func (h *Handler) GetProfile(c *gin.Context) {
	idStr := c.Param("id")
	if idStr == "me" {
		userID, exists := c.Get("userID")
		if !exists {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
			return
		}
		idStr = fmt.Sprintf("%v", userID)
	}

	if idStr == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "user id is required"})
		return
	}

	user, err := h.service.GetUser(idStr)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "user not found"})
		return
	}

	var refName *string
	if user.ReferralID != nil {
		refUser, err := h.service.GetUser(*user.ReferralID)
		if err == nil && refUser != nil {
			refName = &refUser.Name
		}
	}

	var vol *response.Volunteer
	if user.UserType == Volunteer {
		vol, _ = h.service.GetVolunteerByUserID(user.ID.String())
	}

	c.JSON(http.StatusOK, gin.H{"user": mapToResponse(user, refName, vol)})
}

func (h *Handler) GetStats(c *gin.Context) {

	totalUsers, totalPayments, totalReferrals, totalAmount, err := h.service.GetSystemStats()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to fetch stats"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"total_users":     totalUsers,
		"total_payments":  totalPayments,
		"total_amount":    totalAmount,
		"total_referrals": totalReferrals,
	})
}

func (h *Handler) Me(c *gin.Context) {
	userID, exists := c.Get("userID")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
		return
	}

	idStr := fmt.Sprintf("%v", userID)
	user, err := h.service.GetUser(idStr)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "user not found"})
		return
	}

	var refName *string
	if user.ReferralID != nil {
		refUser, err := h.service.GetUser(*user.ReferralID)
		if err == nil && refUser != nil {
			refName = &refUser.Name
		}
	}

	var vol *response.Volunteer
	if user.UserType == Volunteer {
		vol, _ = h.service.GetVolunteerByUserID(user.ID.String())
	}

	c.JSON(http.StatusOK, gin.H{"user": mapToResponse(user, refName, vol)})
}

func (h *Handler) GetAllNonAdminUsers(c *gin.Context) {
	// Check if user is admin
	userType, exists := c.Get("userType")
	if !exists || userType != string(Admin) {
		c.JSON(http.StatusForbidden, gin.H{"error": "forbidden, admin access required"})
		return
	}

	pagination := utils.GetPaginationFromContext(c)
	usersList, err := h.service.GetNonAdminUsers(&pagination)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to fetch users"})
		return
	}

	var res []response.User
	for _, u := range usersList {
		var refName *string
		if u.ReferralID != nil {
			refUser, err := h.service.GetUser(*u.ReferralID)
			if err == nil && refUser != nil {
				refName = &refUser.Name
			}
		}
		res = append(res, mapToResponse(&u, refName, nil))
	}

	c.JSON(http.StatusOK, gin.H{
		"users":      res,
		"pagination": pagination,
	})
}

func (h *Handler) SuspendUser(c *gin.Context) {
	// Check if requester is admin
	userType, exists := c.Get("userType")
	if !exists || userType != string(Admin) {
		c.JSON(http.StatusForbidden, gin.H{"error": "forbidden, admin access required"})
		return
	}

	id := c.Param("id")
	if id == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "user id is required"})
		return
	}

	var req struct {
		IsSuspended bool `json:"is_suspended"`
	}
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := h.service.SuspendUser(id, req.IsSuspended); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "user suspension status updated successfully"})
}

func (h *Handler) DeleteUser(c *gin.Context) {
	// Check if requester is admin
	userType, exists := c.Get("userType")
	if !exists || userType != string(Admin) {
		c.JSON(http.StatusForbidden, gin.H{"error": "forbidden, admin access required"})
		return
	}

	id := c.Param("id")
	if id == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "user id is required"})
		return
	}

	if err := h.service.DeleteUser(id); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "user deleted successfully"})
}

func (h *Handler) GetReferredUsers(c *gin.Context) {
	id := c.Param("id")
	if id == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "user id is required"})
		return
	}

	// The referral_id is a nil field, and we need to return users where their referral_id is this userid.
	usersList, err := h.service.GetUsersByReferralID(id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to fetch referred users"})
		return
	}

	var res []response.User
	for _, u := range usersList {
		// Since all these users have the same referral_id, their referrer is the user with 'id'
		// We could fetch the referrer's name once to set ReferralName, or just set it if needed.
		// For now we just map them.
		res = append(res, mapToResponse(&u, nil, nil))
	}

	c.JSON(http.StatusOK, gin.H{
		"users": res,
	})
}
