package request

type RegisterUser struct {
	Name         string  `json:"name" binding:"required"`
	Phone        string  `json:"phone" binding:"required"`
	Password     string  `json:"password" binding:"required,min=6"`
	ProfilePhoto *string `json:"profile_photo"`
	ReferralID   *string `json:"referral_id"`
}

type LoginUser struct {
	Phone    string `json:"phone" binding:"required"`
	Password string `json:"password" binding:"required"`
}

type ForgetPassword struct {
	Phone       string `json:"phone" binding:"required"`
	NewPassword string `json:"new_password" binding:"required,min=6"`
}

type SuspendUserRequest struct {
	IsSuspended bool `json:"is_suspended"`
}
