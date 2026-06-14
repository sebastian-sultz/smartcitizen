package payment

import (
	"context"
	"fmt"
	"time"
	dtorequest "backend/dto/request"
	"backend/dto/response"
	"backend/pkg/utils"

	"gorm.io/gorm"
	"gorm.io/gorm/clause"
)

type Repository interface {
	CreatePayment(ctx context.Context, payment *Payment) error
	GetPaymentByOrderID(ctx context.Context, orderID string) (*Payment, error)
	UpdatePayment(ctx context.Context, payment *Payment) error
	ListPayments(ctx context.Context, filter dtorequest.PaymentFilter, pagination *utils.Pagination) ([]PaymentWithReceipt, error)
	GetUserDonationStats(ctx context.Context, userID string) (*response.UserDonationStatsResponse, error)
	GetNextReceiptNumber(ctx context.Context) (string, error)
	CreateReceipt(ctx context.Context, receipt *Receipt) error
	GetReceiptByPaymentID(ctx context.Context, paymentID string) (*Receipt, error)
	UpdateReceiptURL(ctx context.Context, receiptID string, url string) error
	GetSuccessfulPaymentsWithReceipts(ctx context.Context, userID string) ([]Payment, []Receipt, error)
	GetPaymentsMissingReceipts(ctx context.Context) ([]Payment, error)
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

func (r *repository) ListPayments(ctx context.Context, filter dtorequest.PaymentFilter, pagination *utils.Pagination) ([]PaymentWithReceipt, error) {
	var payments []PaymentWithReceipt

	query := r.db.WithContext(ctx).Model(&Payment{}).
		Select("payments.*, receipts.receipt_number").
		Joins("LEFT JOIN receipts ON receipts.payment_id = payments.id")

	if filter.UserID != nil && *filter.UserID != "" {
		query = query.Where("payments.user_id = ?", *filter.UserID)
	}

	if filter.Search != nil && *filter.Search != "" {
		searchPattern := "%" + *filter.Search + "%"
		query = query.Where("payments.merchant_order_id ILIKE ? OR payments.provider_reference_id ILIKE ? OR payments.donor_name ILIKE ?", searchPattern, searchPattern, searchPattern)
	}

	if filter.Status != nil && *filter.Status != "" {
		query = query.Where("payments.status = ?", *filter.Status)
	}

	if filter.TaxExemption != nil {
		if *filter.TaxExemption {
			query = query.Where("payments.donor_pan IS NOT NULL AND payments.donor_pan <> ''")
		} else {
			query = query.Where("payments.donor_pan IS NULL OR payments.donor_pan = ''")
		}
	}

	if filter.StartDate != nil && *filter.StartDate != "" {
		if st, err := time.Parse(time.RFC3339, *filter.StartDate); err == nil {
			query = query.Where("payments.created_at >= ?", st)
		} else if st, err := time.Parse("2006-01-02", *filter.StartDate); err == nil {
			query = query.Where("payments.created_at >= ?", st)
		}
	}

	if filter.EndDate != nil && *filter.EndDate != "" {
		if et, err := time.Parse(time.RFC3339, *filter.EndDate); err == nil {
			query = query.Where("payments.created_at <= ?", et)
		} else if et, err := time.Parse("2006-01-02", *filter.EndDate); err == nil {
			query = query.Where("payments.created_at <= ?", et)
		}
	}

	countQuery := r.db.WithContext(ctx).Model(&Payment{})
	if filter.UserID != nil && *filter.UserID != "" {
		countQuery = countQuery.Where("user_id = ?", *filter.UserID)
	}
	if filter.Search != nil && *filter.Search != "" {
		searchPattern := "%" + *filter.Search + "%"
		countQuery = countQuery.Where("merchant_order_id ILIKE ? OR provider_reference_id ILIKE ? OR donor_name ILIKE ?", searchPattern, searchPattern, searchPattern)
	}
	if filter.Status != nil && *filter.Status != "" {
		countQuery = countQuery.Where("status = ?", *filter.Status)
	}
	if filter.TaxExemption != nil {
		if *filter.TaxExemption {
			countQuery = countQuery.Where("donor_pan IS NOT NULL AND donor_pan <> ''")
		} else {
			countQuery = countQuery.Where("donor_pan IS NULL OR donor_pan = ''")
		}
	}
	if filter.StartDate != nil && *filter.StartDate != "" {
		if st, err := time.Parse(time.RFC3339, *filter.StartDate); err == nil {
			countQuery = countQuery.Where("created_at >= ?", st)
		} else if st, err := time.Parse("2006-01-02", *filter.StartDate); err == nil {
			countQuery = countQuery.Where("created_at >= ?", st)
		}
	}
	if filter.EndDate != nil && *filter.EndDate != "" {
		if et, err := time.Parse(time.RFC3339, *filter.EndDate); err == nil {
			countQuery = countQuery.Where("created_at <= ?", et)
		} else if et, err := time.Parse("2006-01-02", *filter.EndDate); err == nil {
			countQuery = countQuery.Where("created_at <= ?", et)
		}
	}

	if err := countQuery.Count(&pagination.TotalRows).Error; err != nil {
		return nil, err
	}
	pagination.Calculate()

	sortBy := "payments.created_at"
	sortOrder := "desc"
	if filter.SortBy != nil && *filter.SortBy != "" {
		val := *filter.SortBy
		if val == "created_at" || val == "amount" || val == "status" || val == "donor_name" {
			sortBy = "payments." + val
		}
	}
	if filter.SortOrder != nil && *filter.SortOrder != "" {
		val := *filter.SortOrder
		if val == "asc" || val == "desc" || val == "ASC" || val == "DESC" {
			sortOrder = val
		}
	}
	query = query.Order(fmt.Sprintf("%s %s", sortBy, sortOrder))

	var err error
	if pagination.Limit > 0 {
		err = query.Offset(pagination.Offset).Limit(pagination.Limit).Find(&payments).Error
	} else {
		err = query.Find(&payments).Error
	}

	if err != nil {
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

	// 1. Total Transactions
	if err := r.db.WithContext(ctx).Model(&Payment{}).
		Where("user_id = ? AND status = ?", userID, PaymentStatusSuccess).
		Count(&stats.TotalTransactions).Error; err != nil {
		return nil, err
	}

	if stats.TotalTransactions == 0 {
		return &stats, nil // Returns zeros if no successful transactions
	}

	// Helper variables for raw sums
	var lifetime, thisYear, lastMonth int64

	// 2. Lifetime Donated
	if err := r.db.WithContext(ctx).Model(&Payment{}).
		Where("user_id = ? AND status = ?", userID, PaymentStatusSuccess).
		Select("COALESCE(SUM(amount), 0)").Scan(&lifetime).Error; err != nil {
		return nil, err
	}

	// 3. Donated This Year
	if err := r.db.WithContext(ctx).Model(&Payment{}).
		Where("user_id = ? AND status = ? AND created_at >= ?", userID, PaymentStatusSuccess, startOfYear).
		Select("COALESCE(SUM(amount), 0)").Scan(&thisYear).Error; err != nil {
		return nil, err
	}

	// 4. Donated Last Month
	if err := r.db.WithContext(ctx).Model(&Payment{}).
		Where("user_id = ? AND status = ? AND created_at >= ? AND created_at <= ?", userID, PaymentStatusSuccess, startOfLastMonth, endOfLastMonth).
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

func (r *repository) GetSuccessfulPaymentsWithReceipts(ctx context.Context, userID string) ([]Payment, []Receipt, error) {
	var payments []Payment
	if err := r.db.WithContext(ctx).
		Where("user_id = ? AND status = ? AND donor_pan IS NOT NULL AND donor_pan <> '' AND donor_address IS NOT NULL AND donor_address <> ''", userID, PaymentStatusSuccess).
		Order("created_at desc").Find(&payments).Error; err != nil {
		return nil, nil, err
	}

	if len(payments) == 0 {
		return nil, nil, nil
	}

	var paymentIDs []string
	for _, p := range payments {
		paymentIDs = append(paymentIDs, p.ID.String())
	}

	var receipts []Receipt
	if err := r.db.WithContext(ctx).Where("payment_id IN ?", paymentIDs).Find(&receipts).Error; err != nil {
		return nil, nil, err
	}

	return payments, receipts, nil
}

func (r *repository) GetPaymentsMissingReceipts(ctx context.Context) ([]Payment, error) {
	var payments []Payment
	err := r.db.WithContext(ctx).
		Where("status = ? AND id NOT IN (SELECT payment_id FROM receipts WHERE cloudinary_url IS NOT NULL AND cloudinary_url <> '')", PaymentStatusSuccess).
		Order("created_at desc").
		Find(&payments).Error
	return payments, err
}
