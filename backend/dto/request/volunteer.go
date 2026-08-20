package request

type CreateVolunteer struct {
	UserID          string   `json:"user_id" binding:"required"`
	Name            string   `json:"name" binding:"required"`
	Email           string   `json:"email" binding:"required,email"`
	Phone           string   `json:"phone" binding:"required"`
	AlternatePhone  string   `json:"alternate_phone"`
	Address         string   `json:"address"`
	City            string   `json:"city"`
	District        string   `json:"district"`
	State           string   `json:"state"`
	Pincode         string   `json:"pincode"`
	Profession      string   `json:"profession"`
	Experience      string   `json:"experience"`
	Specialties     []string `json:"specialties"`
	IsPublicConsent bool     `json:"ispublicconsent"`
	Password        string   `json:"password" binding:"required,min=6"`
}

type UpdateVolunteer struct {
	Name            *string  `json:"name"`
	Email           *string  `json:"email"`
	Phone           *string  `json:"phone"`
	AlternatePhone  *string  `json:"alternate_phone"`
	Address         *string  `json:"address"`
	City            *string  `json:"city"`
	District        *string  `json:"district"`
	State           *string  `json:"state"`
	Pincode         *string  `json:"pincode"`
	Profession      *string  `json:"profession"`
	Experience      *string  `json:"experience"`
	Specialties     []string `json:"specialties"`
	IsPublicConsent *bool    `json:"ispublicconsent"`
	Status          *string  `json:"status"`
}

type UpdateVolunteerStatus struct {
	Status string `json:"status" binding:"required"`
}

type VolunteerFilter struct {
	Search       *string `json:"q" form:"q"`
	Profession   *string `json:"profession" form:"profession"`
	State        *string `json:"state" form:"state"`
	City         *string `json:"city" form:"city"`
	Status       *string `json:"status" form:"status"`
	Sort         *string `json:"sort" form:"sort"`
	StartDate    *string `json:"startDate" form:"startDate"`
	EndDate      *string `json:"endDate" form:"endDate"`
	OnlyApproved *bool   `json:"onlyApproved" form:"onlyApproved"`
}

