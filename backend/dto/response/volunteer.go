package response

import (
	"time"

	"github.com/google/uuid"
)

type Volunteer struct {
	ID              uuid.UUID `json:"id"`
	UserID          uuid.UUID `json:"user_id"`
	Name            string    `json:"name"`
	Email           string    `json:"email"`
	Phone           string    `json:"phone"`
	AlternatePhone  string    `json:"alternate_phone"`
	Address         string    `json:"address"`
	City            string    `json:"city"`
	District        string    `json:"district"`
	State           string    `json:"state"`
	Pincode         string    `json:"pincode"`
	Profession      string    `json:"profession"`
	Experience      string    `json:"experience"`
	Specialties     []string  `json:"specialties"`
	IsPublicConsent bool      `json:"ispublicconsent"`
	Status          string    `json:"status"`
	Image           *string   `json:"image"`
	CreatedAt       time.Time `json:"created_at"`
	UpdatedAt       time.Time `json:"updated_at"`
}
