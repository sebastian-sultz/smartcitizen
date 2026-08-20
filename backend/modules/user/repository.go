package user

import (
	"context"
	"time"

	dtorequest "backend/dto/request"
	"backend/dto/response"
	"backend/pkg/utils"

	"gorm.io/gorm"
)

type UserPaymentRecord struct {
	Amount              int64     `json:"amount"` // in paise
	Status              string    `json:"status"`
	PaymentMethod       string    `json:"paymentMethod"`
	ProviderReferenceID string    `json:"providerReferenceId"`
	MerchantOrderID     string    `json:"merchantOrderId"`
	ReceiptNumber       string    `json:"receiptNumber"`
	CreatedAt           time.Time `json:"createdAt"`
}

type Repository interface {
	Create(user *User) error
	FindByPhone(phone string) (*User, error)
	FindByID(id string) (*User, error)
	Update(user *User) error
	Delete(id string) error
	GetSystemStats() (int64, int64, int64, float64, error)
	FindNonAdminUsers(filter dtorequest.UserFilter, pagination *utils.Pagination) ([]User, error)
	FindAllNonAdminUsers() ([]User, error)
	FindByReferralID(referralID string) ([]User, error)
	FindVolunteerByUserID(userID string) (*response.Volunteer, error)
	RecordSuccessfulPayment(userID string, amount float64) error
	GetDownlineStats(userID string) (int64, float64, error)
	StreamNonAdminUsers(ctx context.Context, filter dtorequest.UserFilter, fn func(u User) error) error
	FindAllNonAdminUsersFiltered(ctx context.Context, filter dtorequest.UserFilter) ([]User, error)
	GetUserPayments(ctx context.Context, userID string) ([]UserPaymentRecord, error)
}

type repository struct {
	db *gorm.DB
}

func NewRepository(db *gorm.DB) Repository {
	return &repository{db: db}
}

func (r *repository) Create(user *User) error {
	return r.db.Transaction(func(tx *gorm.DB) error {
		if err := tx.Create(user).Error; err != nil {
			return err
		}

		if user.ReferralID != nil && *user.ReferralID != "" {
			if err := tx.Model(&User{}).Where("id = ?", *user.ReferralID).UpdateColumn("total_referrals", gorm.Expr("total_referrals + ?", 1)).Error; err != nil {
				return err
			}
		}
		return nil
	})
}

func (r *repository) FindByPhone(phone string) (*User, error) {
	var user User
	err := r.db.Where("phone = ?", phone).First(&user).Error
	if err != nil {
		return nil, err
	}
	return &user, nil
}

func (r *repository) FindByID(id string) (*User, error) {
	var user User
	err := r.db.Where("id = ?", id).First(&user).Error
	if err != nil {
		return nil, err
	}
	return &user, nil
}

func (r *repository) Update(user *User) error {
	return r.db.Transaction(func(tx *gorm.DB) error {
		if err := tx.Save(user).Error; err != nil {
			return err
		}

		// Check if volunteer record exists for this UserID
		var count int64
		tx.Table("volunteers").Where("user_id = ? AND deleted_at IS NULL", user.ID).Count(&count)
		if count > 0 {
			updates := map[string]interface{}{
				"name": user.Name,
			}
			if user.ProfilePhoto != nil {
				updates["image"] = user.ProfilePhoto
			} else {
				updates["image"] = nil
			}
			if user.ProfilePhotoPublicID != nil {
				updates["image_public_id"] = *user.ProfilePhotoPublicID
			} else {
				updates["image_public_id"] = nil
			}
			if err := tx.Table("volunteers").Where("user_id = ?", user.ID).Updates(updates).Error; err != nil {
				return err
			}
		}
		return nil
	})
}

func (r *repository) GetSystemStats() (int64, int64, int64, float64, error) {
	var totalUsers int64
	var totalPayments int64
	var totalReferrals int64
	var totalAmountPaise int64

	err := r.db.Model(&User{}).Where("user_type != ?", Admin).Count(&totalUsers).Error
	if err != nil {
		return 0, 0, 0, 0, err
	}

	err = r.db.Model(&User{}).Select("COALESCE(SUM(total_referrals), 0)").Row().Scan(&totalReferrals)
	if err != nil {
		return 0, 0, 0, 0, err
	}

	err = r.db.Table("payments").Where("status = 'SUCCESS' AND deleted_at IS NULL").Count(&totalPayments).Error
	if err != nil {
		return 0, 0, 0, 0, err
	}

	err = r.db.Table("payments").Where("status = 'SUCCESS' AND deleted_at IS NULL").Select("COALESCE(SUM(amount), 0)").Row().Scan(&totalAmountPaise)
	if err != nil {
		return 0, 0, 0, 0, err
	}

	totalAmountFloat := float64(totalAmountPaise) / 100.0

	return totalUsers, totalPayments, totalReferrals, totalAmountFloat, nil
}

func applyUserFilters(query *gorm.DB, filter dtorequest.UserFilter) *gorm.DB {
	if filter.ReferralsOnly != nil && *filter.ReferralsOnly {
		query = query.Where("total_referrals > ?", 0)
	}

	if filter.Search != nil && *filter.Search != "" {
		query = query.Where("(name ILIKE ? OR phone ILIKE ? OR member_id ILIKE ?)", "%"+*filter.Search+"%", "%"+*filter.Search+"%", "%"+*filter.Search+"%")
	}

	if filter.Role != nil && *filter.Role != "" {
		query = query.Where("user_type = ?", *filter.Role)
	}

	if filter.IsSuspended != nil {
		query = query.Where("is_suspended = ?", *filter.IsSuspended)
	}

	if filter.ReferralsCountMin != nil {
		query = query.Where("total_referrals >= ?", *filter.ReferralsCountMin)
	}
	if filter.ReferralsCountMax != nil {
		query = query.Where("total_referrals <= ?", *filter.ReferralsCountMax)
	}

	if filter.PaymentsCountMin != nil {
		query = query.Where("total_payments >= ?", *filter.PaymentsCountMin)
	}
	if filter.PaymentsCountMax != nil {
		query = query.Where("total_payments <= ?", *filter.PaymentsCountMax)
	}

	if filter.AmountMin != nil {
		query = query.Where("total_amount >= ?", *filter.AmountMin)
	}
	if filter.AmountMax != nil {
		query = query.Where("total_amount <= ?", *filter.AmountMax)
	}

	if filter.JoinedBefore != nil && *filter.JoinedBefore != "" {
		if t, err := time.Parse("2006-01-02", *filter.JoinedBefore); err == nil {
			tEnd := time.Date(t.Year(), t.Month(), t.Day(), 23, 59, 59, 999999999, t.Location())
			query = query.Where("created_at <= ?", tEnd)
		} else if t, err := time.Parse(time.RFC3339, *filter.JoinedBefore); err == nil {
			query = query.Where("created_at <= ?", t)
		}
	}
	if filter.JoinedAfter != nil && *filter.JoinedAfter != "" {
		if t, err := time.Parse("2006-01-02", *filter.JoinedAfter); err == nil {
			tStart := time.Date(t.Year(), t.Month(), t.Day(), 0, 0, 0, 0, t.Location())
			query = query.Where("created_at >= ?", tStart)
		} else if t, err := time.Parse(time.RFC3339, *filter.JoinedAfter); err == nil {
			query = query.Where("created_at >= ?", t)
		}
	}

	return query
}

func getOrderClause(sort *string) string {
	if sort == nil {
		return "created_at desc"
	}
	switch *sort {
	case "name_asc":
		return "name asc"
	case "name_desc":
		return "name desc"
	case "newest":
		return "created_at desc"
	case "oldest":
		return "created_at asc"
	case "referrals_desc":
		return "total_referrals desc"
	case "referrals_asc":
		return "total_referrals asc"
	case "donations_desc":
		return "total_amount desc"
	case "donations_asc":
		return "total_amount asc"
	case "payments_desc":
		return "total_payments desc"
	case "payments_asc":
		return "total_payments asc"
	case "member_id_asc":
		return "member_id asc"
	case "member_id_desc":
		return "member_id desc"
	case "phone_asc":
		return "phone asc"
	case "phone_desc":
		return "phone desc"
	default:
		return "created_at desc"
	}
}

func (r *repository) FindNonAdminUsers(filter dtorequest.UserFilter, pagination *utils.Pagination) ([]User, error) {
	var users []User
	query := r.db.Model(&User{}).Where("user_type != ?", string(Admin))

	query = applyUserFilters(query, filter)

	if err := query.Session(&gorm.Session{}).Count(&pagination.TotalRows).Error; err != nil {
		return nil, err
	}
	pagination.Calculate()

	orderClause := getOrderClause(filter.Sort)

	err := query.Order(orderClause).Limit(pagination.Limit).Offset(pagination.Offset).Find(&users).Error
	return users, err
}

func (r *repository) Delete(id string) error {
	return r.db.Where("id = ?", id).Delete(&User{}).Error
}

func (r *repository) FindByReferralID(referralID string) ([]User, error) {
	var users []User
	// ReferralID is a pointer (*string), we check against the value if provided
	err := r.db.Where("referral_id = ?", referralID).Find(&users).Error
	return users, err
}

func (r *repository) FindVolunteerByUserID(userID string) (*response.Volunteer, error) {
	var vol response.Volunteer
	err := r.db.Table("volunteers").Where("user_id = ? AND deleted_at IS NULL", userID).First(&vol).Error
	if err != nil {
		return nil, err
	}
	return &vol, nil
}

func (r *repository) RecordSuccessfulPayment(userID string, amount float64) error {
	return r.db.Transaction(func(tx *gorm.DB) error {
		var u User
		if err := tx.Where("id = ?", userID).First(&u).Error; err != nil {
			return err
		}

		u.TotalPayments += 1
		u.TotalAmount += amount
		if err := tx.Save(&u).Error; err != nil {
			return err
		}

		if u.ReferralID != nil && *u.ReferralID != "" {
			var referrer User
			if err := tx.Where("id = ?", *u.ReferralID).First(&referrer).Error; err == nil {
				referrer.ReferralPaymentCount += 1
				referrer.ReferralPaymentAmount += amount
				if err := tx.Save(&referrer).Error; err != nil {
					return err
				}
			}
		}

		return nil
	})
}

func (r *repository) FindAllNonAdminUsers() ([]User, error) {
	var users []User
	err := r.db.Where("user_type != ?", string(Admin)).Find(&users).Error
	return users, err
}

func (r *repository) GetDownlineStats(userID string) (int64, float64, error) {
	var result struct {
		Count int64
		Sum   float64
	}

	query := `
		WITH RECURSIVE downline AS (
			SELECT id, total_amount 
			FROM users 
			WHERE referral_id = ? AND deleted_at IS NULL
			UNION ALL
			SELECT u.id, u.total_amount 
			FROM users u
			INNER JOIN downline d ON u.referral_id = CAST(d.id AS text)
			WHERE u.deleted_at IS NULL
		)
		SELECT COUNT(*) as count, COALESCE(SUM(total_amount), 0.0) as sum FROM downline
	`

	err := r.db.Raw(query, userID).Scan(&result).Error
	if err != nil {
		return 0, 0.0, err
	}
	return result.Count, result.Sum, nil
}

func (r *repository) StreamNonAdminUsers(ctx context.Context, filter dtorequest.UserFilter, fn func(u User) error) error {
	query := r.db.WithContext(ctx).Model(&User{}).Where("user_type != ?", string(Admin))
	query = applyUserFilters(query, filter)

	orderClause := getOrderClause(filter.Sort)

	rows, err := query.Order(orderClause).Rows()
	if err != nil {
		return err
	}
	defer rows.Close()

	for rows.Next() {
		select {
		case <-ctx.Done():
			return ctx.Err()
		default:
		}

		var u User
		if err := r.db.ScanRows(rows, &u); err != nil {
			return err
		}
		if err := fn(u); err != nil {
			return err
		}
	}
	return rows.Err()
}

func (r *repository) FindAllNonAdminUsersFiltered(ctx context.Context, filter dtorequest.UserFilter) ([]User, error) {
	var users []User
	query := r.db.WithContext(ctx).Model(&User{}).Where("user_type != ?", string(Admin))
	query = applyUserFilters(query, filter)

	orderClause := getOrderClause(filter.Sort)

	err := query.Order(orderClause).Find(&users).Error
	return users, err
}

func (r *repository) GetUserPayments(ctx context.Context, userID string) ([]UserPaymentRecord, error) {
	var records []UserPaymentRecord
	err := r.db.WithContext(ctx).Table("payments").
		Select("payments.amount, payments.status, payments.payment_method, payments.provider_reference_id, payments.merchant_order_id, COALESCE(receipts.receipt_number, '') as receipt_number, payments.created_at").
		Joins("LEFT JOIN receipts ON receipts.payment_id = payments.id").
		Where("payments.user_id = ? AND payments.deleted_at IS NULL", userID).
		Order("payments.created_at desc").
		Scan(&records).Error
	return records, err
}
