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
	DonorPAN            string         `gorm:"type:varchar(20)" json:"donorPan,omitempty"`
	DonorAddress        string         `gorm:"type:text" json:"donorAddress,omitempty"`
	ReceiptID           *string        `gorm:"type:varchar(100)" json:"receiptId,omitempty"`
	PhonepeResponse     datatypes.JSON `gorm:"type:jsonb" json:"phonepeResponse,omitempty"`
	CreatedAt           time.Time      `json:"createdAt"`
	UpdatedAt           time.Time      `json:"updatedAt"`
	DeletedAt           gorm.DeletedAt `gorm:"index" json:"-"`
}

type PaymentWithReceipt struct {
	Payment
	ReceiptNumber string `gorm:"column:receipt_number" json:"receiptNumber,omitempty"`
}


type Receipt struct {
	ID            uuid.UUID `gorm:"type:uuid;default:gen_random_uuid();primaryKey" json:"id"`
	PaymentID     uuid.UUID `gorm:"type:uuid;uniqueIndex;not null" json:"paymentId"`
	ReceiptNumber string    `gorm:"type:varchar(100);uniqueIndex;not null" json:"receiptNumber"`
	CloudinaryURL string    `gorm:"type:text" json:"cloudinaryUrl"`
	CreatedAt     time.Time `json:"createdAt"`
	UpdatedAt     time.Time `json:"updatedAt"`
}

type ReceiptSequence struct {
	Year      int       `gorm:"primaryKey;autoIncrement:false"`
	LastValue int64     `gorm:"not null;default:0"`
	UpdatedAt time.Time
}
