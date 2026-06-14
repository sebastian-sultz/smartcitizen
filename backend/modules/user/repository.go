package user

import (
	"backend/dto/response"
	"backend/pkg/utils"
	"gorm.io/gorm"
)

type Repository interface {
	Create(user *User) error
	FindByPhone(phone string) (*User, error)
	FindByID(id string) (*User, error)
	Update(user *User) error
	Delete(id string) error
	GetSystemStats() (int64, int64, int64, float64, error)
	FindNonAdminUsers(search string, sort string, pagination *utils.Pagination) ([]User, error)
	FindAllNonAdminUsers() ([]User, error)
	FindByReferralID(referralID string) ([]User, error)
	FindVolunteerByUserID(userID string) (*response.Volunteer, error)
	RecordSuccessfulPayment(userID string, amount float64) error
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
	return r.db.Save(user).Error
}

func (r *repository) GetSystemStats() (int64, int64, int64, float64, error) {
	var totalUsers int64
	var totalPayments int64
	var totalReferrals int64
	var totalAmountPaise int64

	err := r.db.Model(&User{}).Count(&totalUsers).Error
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


func (r *repository) FindNonAdminUsers(search string, sort string, pagination *utils.Pagination) ([]User, error) {
	var users []User
	query := r.db.Model(&User{}).Where("user_type != ?", string(Admin))

	if search != "" {
		query = query.Where("name ILIKE ? OR phone ILIKE ?", "%"+search+"%", "%"+search+"%")
	}

	if err := query.Count(&pagination.TotalRows).Error; err != nil {
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

