package payment

import (
	"context"
	"fmt"
	"time"
	"backend/dto/response"
	"backend/pkg/utils"

	"gorm.io/gorm"
	"gorm.io/gorm/clause"
)

type Repository interface {
	CreatePayment(ctx context.Context, payment *Payment) error
	GetPaymentByOrderID(ctx context.Context, orderID string) (*Payment, error)
	UpdatePayment(ctx context.Context, payment *Payment) error
	ListPayments(ctx context.Context, userID *string, pagination *utils.Pagination) ([]Payment, error)
	GetUserDonationStats(ctx context.Context, userID string) (*response.UserDonationStatsResponse, error)
	GetNextReceiptNumber(ctx context.Context) (string, error)
	CreateReceipt(ctx context.Context, receipt *Receipt) error
	GetReceiptByPaymentID(ctx context.Context, paymentID string) (*Receipt, error)
	UpdateReceiptURL(ctx context.Context, receiptID string, url string) error
}

type repository struct {
	db *gorm.DB
}

func NewRepository(db *gorm.DB) Repository {
	return &repository{db: db}
}

func (r *repository) CreatePayment(ctx context.Context, payment *Payment) error {
	return r.db.WithContext(ctx).Create(payment).Error
}

func (r *repository) GetPaymentByOrderID(ctx context.Context, orderID string) (*Payment, error) {
	var payment Payment
	if err := r.db.WithContext(ctx).Where("merchant_order_id = ?", orderID).First(&payment).Error; err != nil {
		return nil, err
	}
	return &payment, nil
}

func (r *repository) UpdatePayment(ctx context.Context, payment *Payment) error {
	return r.db.WithContext(ctx).Transaction(func(tx *gorm.DB) error {
		var currentPayment Payment
		if err := tx.Where("id = ?", payment.ID).First(&currentPayment).Error; err != nil {
			return err
		}

		if err := tx.Save(payment).Error; err != nil {
			return err
		}

		return nil
	})
}

func (r *repository) ListPayments(ctx context.Context, userID *string, pagination *utils.Pagination) ([]Payment, error) {
	var payments []Payment

	query := r.db.WithContext(ctx).Model(&Payment{})
	if userID != nil {
		query = query.Where("user_id = ?", *userID)
	}

	if err := query.Count(&pagination.TotalRows).Error; err != nil {
		return nil, err
	}
	pagination.Calculate()

	if err := query.Order("created_at desc").Offset(pagination.Offset).Limit(pagination.Limit).Find(&payments).Error; err != nil {
		return nil, err
	}

	return payments, nil
}

func (r *repository) GetUserDonationStats(ctx context.Context, userID string) (*response.UserDonationStatsResponse, error) {
	var stats response.UserDonationStatsResponse
	now := time.Now()

	startOfYear := time.Date(now.Year(), 1, 1, 0, 0, 0, 0, now.Location())

	startOfMonth := time.Date(now.Year(), now.Month(), 1, 0, 0, 0, 0, now.Location())
	startOfLastMonth := startOfMonth.AddDate(0, -1, 0)
	endOfLastMonth := startOfMonth.Add(-time.Nanosecond)

	// Base query for successful payments of this user
	baseQuery := r.db.WithContext(ctx).Model(&Payment{}).
		Where("user_id = ?", userID).
		Where("status = ?", PaymentStatusSuccess)

	// 1. Total Transactions
	if err := baseQuery.Count(&stats.TotalTransactions).Error; err != nil {
		return nil, err
	}

	if stats.TotalTransactions == 0 {
		return &stats, nil // Returns zeros if no successful transactions
	}

	// Helper variable for raw sum
	var lifetime, thisYear, lastMonth int64

	// 2. Lifetime Donated
	if err := baseQuery.Select("COALESCE(SUM(amount), 0)").Scan(&lifetime).Error; err != nil {
		return nil, err
	}

	// 4. Donated This Year
	if err := baseQuery.Where("created_at >= ?", startOfYear).
		Select("COALESCE(SUM(amount), 0)").Scan(&thisYear).Error; err != nil {
		return nil, err
	}

	// 5. Donated Last Month
	if err := baseQuery.Where("created_at >= ? AND created_at <= ?", startOfLastMonth, endOfLastMonth).
		Select("COALESCE(SUM(amount), 0)").Scan(&lastMonth).Error; err != nil {
		return nil, err
	}

	// Convert from paise to rupees
	stats.LifetimeDonated = float64(lifetime) / 100.0
	stats.DonatedThisYear = float64(thisYear) / 100.0
	stats.DonatedLastMonth = float64(lastMonth) / 100.0
	stats.AverageAmount = stats.LifetimeDonated / float64(stats.TotalTransactions)

	return &stats, nil
}

func (r *repository) GetNextReceiptNumber(ctx context.Context) (string, error) {
	loc, _ := time.LoadLocation("Asia/Kolkata")
	now := time.Now().In(loc)
	currentYear := now.Year()
	if now.Month() < time.April {
		currentYear = currentYear - 1
	}

	var seq ReceiptSequence
	err := r.db.WithContext(ctx).Transaction(func(tx *gorm.DB) error {
		if err := tx.Exec("INSERT INTO receipt_sequences (year, last_value, updated_at) VALUES (?, 0, ?) ON CONFLICT DO NOTHING", currentYear, time.Now()).Error; err != nil {
			return err
		}
		
		if err := tx.Clauses(clause.Locking{Strength: "UPDATE"}).Where("year = ?", currentYear).First(&seq).Error; err != nil {
			return err
		}
		
		seq.LastValue++
		seq.UpdatedAt = time.Now()
		return tx.Save(&seq).Error
	})
	
	if err != nil {
		return "", err
	}
	
	return fmt.Sprintf("SCF/%d/%06d", currentYear, seq.LastValue), nil
}

func (r *repository) CreateReceipt(ctx context.Context, receipt *Receipt) error {
	return r.db.WithContext(ctx).Create(receipt).Error
}

func (r *repository) GetReceiptByPaymentID(ctx context.Context, paymentID string) (*Receipt, error) {
	var receipt Receipt
	if err := r.db.WithContext(ctx).Where("payment_id = ?", paymentID).First(&receipt).Error; err != nil {
		return nil, err
	}
	return &receipt, nil
}

func (r *repository) UpdateReceiptURL(ctx context.Context, receiptID string, url string) error {
	return r.db.WithContext(ctx).Model(&Receipt{}).Where("id = ?", receiptID).Update("cloudinary_url", url).Error
}
