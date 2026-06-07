package payment

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/datatypes"
	"gorm.io/gorm"
)

type PaymentStatus string

const (
	PaymentStatusPending   PaymentStatus = "PENDING"
	PaymentStatusSuccess   PaymentStatus = "SUCCESS"
	PaymentStatusFailed    PaymentStatus = "FAILED"
	PaymentStatusCancelled PaymentStatus = "CANCELLED"
)

type Payment struct {
	ID                  uuid.UUID      `gorm:"type:uuid;default:gen_random_uuid();primaryKey" json:"id"`
	UserID              *uuid.UUID     `gorm:"type:uuid;index;null" json:"userId,omitempty"`
	MerchantOrderID     string         `gorm:"type:varchar(255);uniqueIndex;not null" json:"merchantOrderId"`
	ProviderReferenceID string         `gorm:"type:varchar(255);index" json:"providerReferenceId,omitempty"`
	Amount              int64          `gorm:"not null" json:"amount"` // Amount in paise
	Status              PaymentStatus  `gorm:"type:varchar(50);not null;default:'PENDING'" json:"status"`
	PaymentMethod       string         `gorm:"type:varchar(50)" json:"paymentMethod,omitempty"`
	DonorName           string         `gorm:"type:varchar(255)" json:"donorName,omitempty"`
	DonorEmail          string         `gorm:"type:varchar(255)" json:"donorEmail,omitempty"`
	DonorPhone          string         `gorm:"type:varchar(50)" json:"donorPhone,omitempty"`
	PhonepeResponse     datatypes.JSON `gorm:"type:jsonb" json:"phonepeResponse,omitempty"`
	CreatedAt           time.Time      `json:"createdAt"`
	UpdatedAt           time.Time      `json:"updatedAt"`
	DeletedAt           gorm.DeletedAt `gorm:"index" json:"-"`
}
