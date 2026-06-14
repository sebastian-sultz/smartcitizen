package response

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/datatypes"
)

type InitiatePaymentResponse struct {
	RedirectURL     string `json:"redirectUrl"`
	MerchantOrderID string `json:"merchantOrderId"`
}

type Payment struct {
	ID                  uuid.UUID  `json:"id"`
	UserID              *uuid.UUID `json:"userId,omitempty"`
	MerchantOrderID     string     `json:"merchantOrderId"`
	ProviderReferenceID string     `json:"providerReferenceId,omitempty"`
	Amount              int64      `json:"amount"` // Amount in paise
	Status              string     `json:"status"`
	PaymentMethod       string     `json:"paymentMethod,omitempty"`
	DonorName           string     `json:"donorName,omitempty"`
	DonorEmail          string         `json:"donorEmail,omitempty"`
	DonorPhone          string         `json:"donorPhone,omitempty"`
	DonorPAN            string         `json:"donorPan,omitempty"`
	DonorAddress        string         `json:"donorAddress,omitempty"`
	PhonepeResponse     datatypes.JSON `json:"phonepeResponse,omitempty"`
	ReceiptNumber       string         `json:"receiptNumber,omitempty"`
	CreatedAt           time.Time      `json:"createdAt"`
	UpdatedAt           time.Time      `json:"updatedAt"`
}

type UserDonationStatsResponse struct {
	LifetimeDonated   float64 `json:"lifetimeDonated"`
	DonatedThisYear   float64 `json:"donatedThisYear"`
	DonatedLastMonth  float64 `json:"donatedLastMonth"`
	TotalTransactions int64   `json:"totalTransactions"`
	AverageAmount     float64 `json:"averageAmount"`
}

type TaxCertificate struct {
	ID          string  `json:"id"`
	FiscalYear  string  `json:"fiscalYear"`
	Amount      float64 `json:"amount"`
	Status      string  `json:"status"` // generated, pending
	DownloadURL string  `json:"downloadUrl"`
}
