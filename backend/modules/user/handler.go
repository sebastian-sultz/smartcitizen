package user

import (
	"fmt"
	"io"
	"net"
	"net/http"
	"net/url"
	"os"
	"strings"
	"time"

	"backend/dto/request"
	"backend/dto/response"
	"backend/pkg/cloudinary"
	"backend/pkg/jwt"
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

func (h *Handler) issueAuthTokens(c *gin.Context, userID uuid.UUID, userType string) error {
	secret := os.Getenv("JWT_SECRET")
	if secret == "" {
		return fmt.Errorf("JWT_SECRET is not configured")
	}
	accessToken, refreshToken, err := jwt.GenerateTokens(userID, userType, secret)
	if err != nil {
		return err
	}
	utils.SetAuthCookies(c, accessToken, refreshToken)
	return nil
}

func mapToResponse(u *User, refName *string, vol *response.Volunteer, stats *response.UserNetworkStatsResponse) response.User {
	var overallReferrals int64
	var overallNetworkDonation float64
	if stats != nil {
		overallReferrals = stats.TotalDownlineCount
		overallNetworkDonation = stats.TotalNetworkDonationAmount
	}
	return response.User{
		ID:                    u.ID,
		MemberID:              u.MemberID,
		Name:                  u.Name,
		Phone:                 u.Phone,
		ProfilePhoto:          u.ProfilePhoto,
		UserType:              string(u.UserType),
		TotalPayments:         u.TotalPayments,
		TotalAmount:           u.TotalAmount,
		ReferralPaymentCount:  u.ReferralPaymentCount,
		ReferralPaymentAmount: u.ReferralPaymentAmount,
		TotalReferrals:        u.TotalReferrals,
		OverallReferrals:      overallReferrals,
		OverallNetworkDonation: overallNetworkDonation,
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

	if err := h.issueAuthTokens(c, user.ID, string(user.UserType)); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to generate tokens"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"message": "registered successfully", "user": mapToResponse(user, nil, nil, nil)})
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

	if err := h.issueAuthTokens(c, user.ID, string(user.UserType)); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to generate tokens"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "logged in successfully", "user": mapToResponse(user, nil, nil, nil)})
}

func (h *Handler) CheckRole(c *gin.Context) {
	var req request.CheckRoleRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	user, err := h.service.GetUserByPhone(req.Phone)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Mobile number is not registered. Please sign up first."})
		return
	}

	if user.IsSuspended {
		c.JSON(http.StatusForbidden, gin.H{"error": "your account has been suspended"})
		return
	}

	if user.UserType == Member {
		if err := h.issueAuthTokens(c, user.ID, string(user.UserType)); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to generate tokens"})
			return
		}

		c.JSON(http.StatusOK, gin.H{
			"message":           "logged in successfully",
			"authenticated":     true,
			"password_required": false,
			"role":              string(user.UserType),
			"user":              mapToResponse(user, nil, nil, nil),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message":           "password required",
		"authenticated":     false,
		"password_required": true,
		"role":              string(user.UserType),
	})
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
		c.JSON(http.StatusInternalServerError, gin.H{"error": "JWT_SECRET is not configured"})
		return
	}

	claims, err := jwt.ParseToken(refreshToken, secret)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "invalid refresh token"})
		return
	}

	// Verify user exists and is active in database
	user, err := h.service.GetUser(claims.UserID.String())
	if err != nil || user == nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "user no longer exists"})
		return
	}

	if user.IsSuspended {
		c.JSON(http.StatusForbidden, gin.H{"error": "account suspended"})
		return
	}

	if err := h.issueAuthTokens(c, user.ID, string(user.UserType)); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to generate tokens"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "token refreshed successfully"})
}

func (h *Handler) Logout(c *gin.Context) {
	utils.ClearAuthCookies(c)
	c.JSON(http.StatusOK, gin.H{"message": "logged out successfully"})
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

	netStats, _ := h.service.GetNetworkStats(c.Request.Context(), idStr)
	c.JSON(http.StatusOK, gin.H{"user": mapToResponse(user, refName, vol, netStats)})
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

	netStats, _ := h.service.GetNetworkStats(c.Request.Context(), idStr)
	c.JSON(http.StatusOK, gin.H{"user": mapToResponse(user, refName, vol, netStats)})
}

func (h *Handler) GetAllNonAdminUsers(c *gin.Context) {
	// Check if user is admin
	userType, exists := c.Get("userType")
	if !exists || userType != string(Admin) {
		c.JSON(http.StatusForbidden, gin.H{"error": "forbidden, admin access required"})
		return
	}

	search := c.Query("q")
	sort := c.Query("sort")
	referralsOnly := c.Query("referrals_only") == "true"

	pagination := utils.GetPaginationFromContext(c)
	usersList, err := h.service.GetNonAdminUsers(search, sort, referralsOnly, &pagination)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to fetch users"})
		return
	}

	res := make([]response.User, 0)
	for _, u := range usersList {
		var refName *string
		if u.ReferralID != nil {
			refUser, err := h.service.GetUser(*u.ReferralID)
			if err == nil && refUser != nil {
				refName = &refUser.Name
			}
		}
		netStats, _ := h.service.GetNetworkStats(c.Request.Context(), u.ID.String())
		res = append(res, mapToResponse(&u, refName, nil, netStats))
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

	var req request.SuspendUserRequest
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
		netStats, _ := h.service.GetNetworkStats(c.Request.Context(), u.ID.String())
		res = append(res, mapToResponse(&u, nil, nil, netStats))
	}

	c.JSON(http.StatusOK, gin.H{
		"users": res,
	})
}

func (h *Handler) GetDownlineNetwork(c *gin.Context) {
	id := c.Param("id")
	if id == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "user id is required"})
		return
	}

	recursive := c.Query("recursive") == "true"
	pagination := utils.GetPaginationFromContext(c)

	res, err := h.service.GetDownlineNetwork(c.Request.Context(), id, recursive, &pagination)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, res)
}

func (h *Handler) GetNetworkStats(c *gin.Context) {
	id := c.Param("id")
	if id == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "user id is required"})
		return
	}

	res, err := h.service.GetNetworkStats(c.Request.Context(), id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, res)
}

func (h *Handler) AddDirectMember(c *gin.Context) {
	userID, exists := c.Get("userID")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
		return
	}

	var req request.AddDirectMember
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	referrerID := fmt.Sprintf("%v", userID)
	user, err := h.service.AddDirectMember(referrerID, &req)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"message": "member enrolled successfully",
		"user":    mapToResponse(user, nil, nil, nil),
	})
}

func (h *Handler) ProxyImage(c *gin.Context) {
	targetURL := c.Query("url")
	if targetURL == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Missing url query parameter"})
		return
	}

	parsedURL, err := url.Parse(targetURL)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid URL format"})
		return
	}

	if parsedURL.Scheme != "http" && parsedURL.Scheme != "https" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Only http and https schemes are allowed"})
		return
	}

	host := parsedURL.Host
	if hHost, _, err := net.SplitHostPort(parsedURL.Host); err == nil {
		host = hHost
	}

	ips, err := net.LookupIP(host)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Failed to resolve hostname"})
		return
	}

	for _, ip := range ips {
		if ip.IsLoopback() || ip.IsLinkLocalUnicast() || ip.IsLinkLocalMulticast() || ip.IsPrivate() {
			c.JSON(http.StatusForbidden, gin.H{"error": "Access to private or local network is forbidden"})
			return
		}
	}

	// Create client with timeout to prevent connection leakage
	client := &http.Client{
		Timeout: 5 * time.Second,
	}

	// Fetch the remote image
	resp, err := client.Get(targetURL)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch remote image"})
		return
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		c.JSON(resp.StatusCode, gin.H{"error": "Remote server returned non-200 status"})
		return
	}

	// Safety check: ensure content-type is indeed an image to prevent XSS
	contentType := resp.Header.Get("Content-Type")
	if !strings.HasPrefix(contentType, "image/") {
		c.JSON(http.StatusBadRequest, gin.H{"error": "URL does not point to a valid image"})
		return
	}

	// Set content headers and CORS headers
	c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
	c.Writer.Header().Set("Content-Type", contentType)
	wCacheHeader := resp.Header.Get("Cache-Control")
	if wCacheHeader != "" {
		c.Writer.Header().Set("Cache-Control", wCacheHeader)
	} else {
		c.Writer.Header().Set("Cache-Control", "public, max-age=86400") // Default to caching for 1 day
	}

	// Stream response body back to Gin response writer
	_, err = io.Copy(c.Writer, resp.Body)
	if err != nil {
		c.Error(err)
	}
}
