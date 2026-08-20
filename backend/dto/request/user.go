package request

type RegisterUser struct {
	Name         string  `json:"name" binding:"required"`
	Phone        string  `json:"phone" binding:"required"`
	Password     string  `json:"password"`
	ProfilePhoto *string `json:"profile_photo"`
	ReferralID   *string `json:"referral_id"`
}

type CheckRoleRequest struct {
	Phone string `json:"phone" binding:"required"`
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

type AddDirectMember struct {
	Name  string `json:"name" binding:"required"`
	Phone string `json:"phone" binding:"required"`
}

type UserFilter struct {
	Search            *string  `json:"q" form:"q"`
	Sort              *string  `json:"sort" form:"sort"`
	Role              *string  `json:"role" form:"role"`
	IsSuspended       *bool    `json:"is_suspended" form:"is_suspended"`
	ReferralsCountMin *int     `json:"min_referrals" form:"min_referrals"`
	ReferralsCountMax *int     `json:"max_referrals" form:"max_referrals"`
	PaymentsCountMin  *int     `json:"min_payments" form:"min_payments"`
	PaymentsCountMax  *int     `json:"max_payments" form:"max_payments"`
	AmountMin         *float64 `json:"min_amount" form:"min_amount"`
	AmountMax         *float64 `json:"max_amount" form:"max_amount"`
	JoinedBefore      *string  `json:"joined_before" form:"joined_before"`
	JoinedAfter       *string  `json:"joined_after" form:"joined_after"`
	ReferralsOnly     *bool    `json:"referrals_only" form:"referrals_only"`
}

