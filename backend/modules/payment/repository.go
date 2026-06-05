package payment

import (
	"context"

	"gorm.io/gorm"
)

type Repository interface {
	CreatePayment(ctx context.Context, payment *Payment) error
	GetPaymentByOrderID(ctx context.Context, orderID string) (*Payment, error)
	UpdatePayment(ctx context.Context, payment *Payment) error
	ListPayments(ctx context.Context, userID *string, page, limit int) ([]Payment, int64, error)
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
	return r.db.WithContext(ctx).Save(payment).Error
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
