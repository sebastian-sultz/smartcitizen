package user

import (
	"context"
	"time"

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
	FindNonAdminUsers(search string, sort string, referralsOnly bool, pagination *utils.Pagination) ([]User, error)
	FindAllNonAdminUsers() ([]User, error)
	FindByReferralID(referralID string) ([]User, error)
	FindVolunteerByUserID(userID string) (*response.Volunteer, error)
	RecordSuccessfulPayment(userID string, amount float64) error
	GetDownlineStats(userID string) (int64, float64, error)
	StreamNonAdminUsers(ctx context.Context, search string, sort string, fn func(u User) error) error
	FindAllNonAdminUsersFiltered(ctx context.Context, search string, sort string) ([]User, error)
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

func (r *repository) FindNonAdminUsers(search string, sort string, referralsOnly bool, pagination *utils.Pagination) ([]User, error) {
	var users []User
	query := r.db.Model(&User{}).Where("user_type != ?", string(Admin))

	if referralsOnly {
		query = query.Where("total_referrals > ?", 0)
	}

	if search != "" {
		query = query.Where("(name ILIKE ? OR phone ILIKE ? OR member_id ILIKE ?)", "%"+search+"%", "%"+search+"%", "%"+search+"%")
	}

	if err := query.Session(&gorm.Session{}).Count(&pagination.TotalRows).Error; err != nil {
		return nil, err
	}
	pagination.Calculate()

	orderClause := "created_at desc"
	if sort != "" {
		switch sort {
		case "name_asc":
			orderClause = "name asc"
		case "name_desc":
			orderClause = "name desc"
		case "newest":
			orderClause = "created_at desc"
		case "oldest":
			orderClause = "created_at asc"
		case "referrals_desc":
			orderClause = "total_referrals desc"
		case "donations_desc":
			orderClause = "total_amount desc"
		}
	}

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

func (r *repository) StreamNonAdminUsers(ctx context.Context, search string, sort string, fn func(u User) error) error {
	query := r.db.WithContext(ctx).Model(&User{}).Where("user_type != ?", string(Admin))

	if search != "" {
		query = query.Where("(name ILIKE ? OR phone ILIKE ? OR member_id ILIKE ?)", "%"+search+"%", "%"+search+"%", "%"+search+"%")
	}

	orderClause := "created_at desc"
	if sort != "" {
		switch sort {
		case "name_asc":
			orderClause = "name asc"
		case "name_desc":
			orderClause = "name desc"
		case "newest":
			orderClause = "created_at desc"
		case "oldest":
			orderClause = "created_at asc"
		case "referrals_desc":
			orderClause = "total_referrals desc"
		case "donations_desc":
			orderClause = "total_amount desc"
		}
	}

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

func (r *repository) FindAllNonAdminUsersFiltered(ctx context.Context, search string, sort string) ([]User, error) {
	var users []User
	query := r.db.WithContext(ctx).Model(&User{}).Where("user_type != ?", string(Admin))

	if search != "" {
		query = query.Where("(name ILIKE ? OR phone ILIKE ? OR member_id ILIKE ?)", "%"+search+"%", "%"+search+"%", "%"+search+"%")
	}

	orderClause := "created_at desc"
	if sort != "" {
		switch sort {
		case "name_asc":
			orderClause = "name asc"
		case "name_desc":
			orderClause = "name desc"
		case "newest":
			orderClause = "created_at desc"
		case "oldest":
			orderClause = "created_at asc"
		case "referrals_desc":
			orderClause = "total_referrals desc"
		case "donations_desc":
			orderClause = "total_amount desc"
		}
	}

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
