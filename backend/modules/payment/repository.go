package payment

import (
	"backend/modules/user"
	"context"
	"time"

	"gorm.io/gorm"
)

type UserDonationStats struct {
	LifetimeDonated   int64
	DonatedThisYear   int64
	DonatedLastMonth  int64
	TotalTransactions int64
	AverageAmount     int64
}

type Repository interface {
	CreatePayment(ctx context.Context, payment *Payment) error
	GetPaymentByOrderID(ctx context.Context, orderID string) (*Payment, error)
	UpdatePayment(ctx context.Context, payment *Payment) error
	ListPayments(ctx context.Context, userID *string, page, limit int) ([]Payment, int64, error)
	GetUserDonationStats(ctx context.Context, userID string) (*UserDonationStats, error)
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

		if currentPayment.Status != PaymentStatusSuccess && payment.Status == PaymentStatusSuccess {
			if payment.UserID != nil {
				var u user.User
				if err := tx.Where("id = ?", *payment.UserID).First(&u).Error; err == nil {
					u.TotalPayments += 1
					u.TotalAmount += float64(payment.Amount) / 100.0
					if err := tx.Save(&u).Error; err != nil {
						return err
					}

					if u.ReferralID != nil && *u.ReferralID != "" {
						var referrer user.User
						if err := tx.Where("id = ?", *u.ReferralID).First(&referrer).Error; err == nil {
							referrer.ReferralPaymentCount += 1
							referrer.ReferralPaymentAmount += float64(payment.Amount) / 100.0
							if err := tx.Save(&referrer).Error; err != nil {
								return err
							}
						}
					}
				}
			}
		}

		return nil
	})
}

func (r *repository) ListPayments(ctx context.Context, userID *string, page, limit int) ([]Payment, int64, error) {
	var payments []Payment
	var total int64

	query := r.db.WithContext(ctx).Model(&Payment{})
	if userID != nil {
		query = query.Where("user_id = ?", *userID)
	}

	if err := query.Count(&total).Error; err != nil {
		return nil, 0, err
	}

	offset := (page - 1) * limit
	if err := query.Order("created_at desc").Offset(offset).Limit(limit).Find(&payments).Error; err != nil {
		return nil, 0, err
	}

	return payments, total, nil
}

func (r *repository) GetUserDonationStats(ctx context.Context, userID string) (*UserDonationStats, error) {
	var stats UserDonationStats
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

	// 2. Lifetime Donated
	if err := baseQuery.Select("COALESCE(SUM(amount), 0)").Scan(&stats.LifetimeDonated).Error; err != nil {
		return nil, err
	}

	// 3. Average Amount
	stats.AverageAmount = stats.LifetimeDonated / stats.TotalTransactions

	// 4. Donated This Year
	if err := baseQuery.Where("created_at >= ?", startOfYear).
		Select("COALESCE(SUM(amount), 0)").Scan(&stats.DonatedThisYear).Error; err != nil {
		return nil, err
	}

	// 5. Donated Last Month
	if err := baseQuery.Where("created_at >= ? AND created_at <= ?", startOfLastMonth, endOfLastMonth).
		Select("COALESCE(SUM(amount), 0)").Scan(&stats.DonatedLastMonth).Error; err != nil {
		return nil, err
	}

	return &stats, nil
}
