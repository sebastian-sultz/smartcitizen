package response

import (
	"time"

	"github.com/google/uuid"
)

type User struct {
	ID                    uuid.UUID  `json:"id"`
	MemberID              string     `json:"member_id"`
	Name                  string     `json:"name"`
	Phone                 string     `json:"phone"`
	ProfilePhoto          *string    `json:"profile_photo"`
	UserType              string     `json:"user_type"`
	TotalPayments         int64      `json:"total_payments"`
	TotalAmount           float64    `json:"total_amount"`
	ReferralPaymentCount  int64      `json:"referral_payment_count"`
	ReferralPaymentAmount float64    `json:"referral_payment_amount"`
	TotalReferrals        int64      `json:"total_referrals"`
	TotalEventsRegistered int64      `json:"total_events_registered"`
	ReferralID            *string    `json:"referral_id"`
	ReferralName          *string    `json:"referral_name,omitempty"`
	IsSuspended           bool       `json:"is_suspended"`
	Volunteer             *Volunteer `json:"volunteer,omitempty"`
	CreatedAt             time.Time  `json:"created_at"`
	UpdatedAt             time.Time  `json:"updated_at"`
}

type ReferralInfo struct {
	ID                    uuid.UUID `json:"id"`
	Name                  string    `json:"name"`
	Phone                 string    `json:"phone"`
	Level                 int       `json:"level"`
	TotalDirectDonations  float64   `json:"totalDirectDonations"`
	TotalNetworkDonations float64   `json:"totalNetworkDonations"`
	JoinedAt              time.Time `json:"joinedAt"`
}

type UserNetworkResponse struct {
	UserID    string         `json:"userId"`
	Referrals []ReferralInfo `json:"referrals"`
}

type UserNetworkStatsResponse struct {
	DirectReferralsCount         int64   `json:"directReferralsCount"`
	TotalDownlineCount           int64   `json:"totalDownlineCount"`
	DirectReferralDonationAmount float64 `json:"directReferralDonationAmount"`
	TotalNetworkDonationAmount   float64 `json:"totalNetworkDonationAmount"`
}
