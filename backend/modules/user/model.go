package user

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type UserType string

const (
	Admin  UserType = "admin"
	Member UserType = "member"
)

// Base model using Google UUID
type Base struct {
	ID        uuid.UUID      `gorm:"type:uuid;primaryKey" json:"id"`
	CreatedAt time.Time      `json:"created_at"`
	UpdatedAt time.Time      `json:"updated_at"`
	DeletedAt gorm.DeletedAt `gorm:"index" json:"deleted_at,omitempty"`
}

func (base *Base) BeforeCreate(tx *gorm.DB) error {
	if base.ID == uuid.Nil {
		base.ID = uuid.New()
	}
	return nil
}

type User struct {
	Base
	Name                 string   `gorm:"not null" json:"name"`
	Phone                string   `gorm:"uniqueIndex;not null" json:"phone"`
	Password             string   `gorm:"not null" json:"-"`
	ProfilePhoto         *string  `json:"profile_photo"`
	UserType             UserType `gorm:"type:varchar(20);not null;default:'member'" json:"user_type"`
	TotalPayments        int      `gorm:"default:0" json:"total_payments"`
	TotalAmount          float64  `gorm:"default:0.0" json:"total_amount"`
	ReferralPaymentCount int      `gorm:"default:0" json:"referral_payment_count"`
	ReferralID           *string  `json:"referral_id"`
	IsPhoneVerified      bool     `gorm:"default:false" json:"is_phone_verified"` // For future OTP implementation
}
