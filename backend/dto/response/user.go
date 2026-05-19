package response

import (
	"time"

	"github.com/google/uuid"
)

type User struct {
	ID                   uuid.UUID `json:"id"`
	Name                 string    `json:"name"`
	Phone                string    `json:"phone"`
	ProfilePhoto         *string   `json:"profile_photo"`
	UserType             string    `json:"user_type"`
	TotalPayments        int       `json:"total_payments"`
	TotalAmount          float64   `json:"total_amount"`
	ReferralPaymentCount int       `json:"referral_payment_count"`
	ReferralID           *string   `json:"referral_id"`
	CreatedAt            time.Time `json:"created_at"`
	UpdatedAt            time.Time `json:"updated_at"`
}
