package analytics

import (
	"context"
	"time"

	"gorm.io/gorm"
)

type Repository interface {
	GetRegistrationGrowth(ctx context.Context) ([]RegistrationGrowth, error)
	GetDonationGrowth(ctx context.Context) ([]DonationGrowth, error)
	GetVolunteerActivity(ctx context.Context) ([]VolunteerActivity, error)
	GetReceiptStats(ctx context.Context) (*ReceiptStats, error)
}

type repository struct {
	db *gorm.DB
}

func NewRepository(db *gorm.DB) Repository {
	return &repository{db: db}
}

func (r *repository) GetRegistrationGrowth(ctx context.Context) ([]RegistrationGrowth, error) {
	var results []struct {
		Month string
		Count int64
	}

	err := r.db.WithContext(ctx).Table("users").
		Select("TO_CHAR(created_at, 'YYYY-MM') as month, count(*) as count").
		Where("created_at >= ? AND user_type != 'admin' AND deleted_at IS NULL", time.Now().AddDate(0, -12, 0)).
		Group("month").
		Order("month ASC").
		Scan(&results).Error

	if err != nil {
		return nil, err
	}

	var growths []RegistrationGrowth
	for _, res := range results {
		growths = append(growths, RegistrationGrowth{
			Month: res.Month,
			Count: res.Count,
		})
	}
	return growths, nil
}

func (r *repository) GetDonationGrowth(ctx context.Context) ([]DonationGrowth, error) {
	var results []struct {
		Month string
		Total int64
	}

	err := r.db.WithContext(ctx).Table("payments").
		Select("TO_CHAR(created_at, 'YYYY-MM') as month, sum(amount) as total").
		Where("created_at >= ? AND status = 'SUCCESS' AND deleted_at IS NULL", time.Now().AddDate(0, -12, 0)).
		Group("month").
		Order("month ASC").
		Scan(&results).Error

	if err != nil {
		return nil, err
	}

	var growths []DonationGrowth
	for _, res := range results {
		growths = append(growths, DonationGrowth{
			Month: res.Month,
			Total: float64(res.Total) / 100.0, // Convert paise to INR
		})
	}
	return growths, nil
}

func (r *repository) GetVolunteerActivity(ctx context.Context) ([]VolunteerActivity, error) {
	var results []struct {
		Profession string
		Status     string
		Count      int64
	}

	err := r.db.WithContext(ctx).Table("volunteers").
		Select("COALESCE(profession, 'Unspecified') as profession, status, count(*) as count").
		Where("deleted_at IS NULL").
		Group("profession, status").
		Scan(&results).Error

	if err != nil {
		return nil, err
	}

	var splits []VolunteerActivity
	for _, res := range results {
		splits = append(splits, VolunteerActivity{
			Category: res.Profession,
			Status:   res.Status,
			Count:    res.Count,
		})
	}
	return splits, nil
}

func (r *repository) GetReceiptStats(ctx context.Context) (*ReceiptStats, error) {
	var totalSuccess int64
	var totalReceipts int64

	if err := r.db.WithContext(ctx).Table("payments").
		Where("status = 'SUCCESS' AND deleted_at IS NULL").
		Count(&totalSuccess).Error; err != nil {
		return nil, err
	}

	if err := r.db.WithContext(ctx).Table("receipts").
		Joins("JOIN payments ON payments.id = receipts.payment_id").
		Where("payments.status = 'SUCCESS' AND payments.deleted_at IS NULL").
		Where("receipts.cloudinary_url IS NOT NULL AND receipts.cloudinary_url <> ''").
		Count(&totalReceipts).Error; err != nil {
		return nil, err
	}

	pendingCount := totalSuccess - totalReceipts
	if pendingCount < 0 {
		pendingCount = 0
	}

	return &ReceiptStats{
		SuccessPayments: totalSuccess,
		GeneratedCount:  totalReceipts,
		PendingCount:    pendingCount,
	}, nil
}
