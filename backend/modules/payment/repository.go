package payment

import (
	"context"
	"time"
	"backend/dto/response"
	"backend/pkg/utils"

	"gorm.io/gorm"
)

type Repository interface {
	CreatePayment(ctx context.Context, payment *Payment) error
	GetPaymentByOrderID(ctx context.Context, orderID string) (*Payment, error)
	UpdatePayment(ctx context.Context, payment *Payment) error
	ListPayments(ctx context.Context, userID *string, pagination *utils.Pagination) ([]Payment, error)
	GetUserDonationStats(ctx context.Context, userID string) (*response.UserDonationStatsResponse, error)
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
