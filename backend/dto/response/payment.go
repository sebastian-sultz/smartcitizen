package response

import (
	"time"

	"github.com/google/uuid"
)

type InitiatePaymentResponse struct {
	RedirectURL     string `json:"redirectUrl"`
	MerchantOrderID string `json:"merchantOrderId"`
}

type Payment struct {
	ID                  uuid.UUID `json:"id"`
	UserID              *uuid.UUID `json:"userId,omitempty"`
	MerchantOrderID     string    `json:"merchantOrderId"`
	ProviderReferenceID string    `json:"providerReferenceId,omitempty"`
	Amount              int64     `json:"amount"` // Amount in paise
	Status              string    `json:"status"`
	PaymentMethod       string    `json:"paymentMethod,omitempty"`
	DonorName           string    `json:"donorName,omitempty"`
	DonorEmail          string    `json:"donorEmail,omitempty"`
	DonorPhone          string    `json:"donorPhone,omitempty"`
	CreatedAt           time.Time `json:"createdAt"`
	UpdatedAt           time.Time `json:"updatedAt"`
}

type PaymentHistoryResponse struct {
	Data       []Payment `json:"data"`
	TotalCount int64     `json:"totalCount"`
	Page       int       `json:"page"`
	Limit      int       `json:"limit"`
}
