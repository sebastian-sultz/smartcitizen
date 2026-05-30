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
	TotalPayments        int64     `json:"total_payments"`
	TotalAmount          float64   `json:"total_amount"`
	ReferralPaymentCount int64     `json:"referral_payment_count"`
	TotalReferrals        int64     `json:"total_referrals"`
	TotalEventsRegistered int64     `json:"total_events_registered"`
	ReferralID           *string   `json:"referral_id"`
	ReferralName         *string   `json:"referral_name,omitempty"`
	CreatedAt            time.Time `json:"created_at"`
	UpdatedAt            time.Time `json:"updated_at"`
}
