package request

type CreateVolunteer struct {
	UserID         string `json:"user_id" binding:"required"`
	Name           string `json:"name" binding:"required"`
	Email          string `json:"email" binding:"required,email"`
	Phone          string `json:"phone" binding:"required"`
	AlternatePhone string `json:"alternate_phone"`
	Address        string `json:"address"`
	City           string `json:"city"`
	District       string `json:"district"`
	Pincode        string `json:"pincode"`
	Profession     string `json:"profession"`
	Experience     string `json:"experience"`
	IsPublicConsent bool  `json:"ispublicconsent"`
}

type UpdateVolunteer struct {
	Name           *string `json:"name"`
	Email          *string `json:"email"`
	Phone          *string `json:"phone"`
	AlternatePhone *string `json:"alternate_phone"`
	Address        *string `json:"address"`
	City           *string `json:"city"`
	District       *string `json:"district"`
	Pincode        *string `json:"pincode"`
	Profession     *string `json:"profession"`
	Experience     *string `json:"experience"`
	IsPublicConsent *bool  `json:"ispublicconsent"`
	Status          *string `json:"status"`
}
