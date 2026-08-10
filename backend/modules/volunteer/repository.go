package volunteer

import (
	"backend/modules/user"
	"backend/pkg/utils"

	"gorm.io/gorm"
)

type VolunteerFilter struct {
	Search       string
	Profession   string
	State        string
	City         string
	Sort         string
	OnlyApproved bool
}

type Repository interface {
	Create(volunteer *Volunteer) error
	FindByID(id string) (*Volunteer, error)
	FindAll(filter VolunteerFilter, pagination *utils.Pagination) ([]Volunteer, error)
	Update(volunteer *Volunteer) error
	Delete(id string) error
	UpdateStatus(volunteerID string, status string, userID string, targetUserType string) error
}

type repository struct {
	db *gorm.DB
}

func NewRepository(db *gorm.DB) Repository {
	return &repository{db: db}
}

func (r *repository) Create(volunteer *Volunteer) error {
	return r.db.Transaction(func(tx *gorm.DB) error {
		if err := tx.Create(volunteer).Error; err != nil {
			return err
		}
		if volunteer.Status == VolunteerStatusApproved {
			if err := tx.Model(&user.User{}).Where("id = ?", volunteer.UserID).Update("user_type", string(user.Volunteer)).Error; err != nil {
				return err
			}
		}
		return nil
	})
}

func (r *repository) FindByID(id string) (*Volunteer, error) {
	var volunteer Volunteer
	err := r.db.Where("id = ?", id).First(&volunteer).Error
	if err != nil {
		return nil, err
	}
	return &volunteer, nil
}

func (r *repository) FindAll(filter VolunteerFilter, pagination *utils.Pagination) ([]Volunteer, error) {
	var volunteers []Volunteer
	query := r.db.Model(&Volunteer{})

	if filter.OnlyApproved {
		query = query.Where("status = ? AND is_public_consent = ?", "APPROVED", true)
	}

	if filter.Search != "" {
		searchTerm := "%" + filter.Search + "%"
		query = query.Where(
			"name ILIKE ? OR profession ILIKE ? OR specialties ILIKE ? OR experience ILIKE ? OR city ILIKE ? OR district ILIKE ? OR state ILIKE ? OR pincode ILIKE ? OR address ILIKE ?",
			searchTerm, searchTerm, searchTerm, searchTerm, searchTerm, searchTerm, searchTerm, searchTerm, searchTerm,
		)
	}

	if filter.Profession != "" && filter.Profession != "All" {
		query = query.Where("profession ILIKE ?", filter.Profession)
	}

	if filter.State != "" && filter.State != "All" {
		query = query.Where("state ILIKE ?", filter.State)
	}

	if filter.City != "" && filter.City != "All" {
		cityTerm := filter.City
		query = query.Where("city ILIKE ? OR district ILIKE ?", cityTerm, cityTerm)
	}

	if err := query.Count(&pagination.TotalRows).Error; err != nil {
		return nil, err
	}
	pagination.Calculate()

	// Ordering logic
	orderClause := "created_at desc"
	switch filter.Sort {
	case "name_asc":
		orderClause = "name asc"
	case "name_desc":
		orderClause = "name desc"
	case "profession":
		orderClause = "profession asc"
	case "newest":
		orderClause = "created_at desc"
	}

	err := query.Order(orderClause).Limit(pagination.Limit).Offset(pagination.Offset).Find(&volunteers).Error
	return volunteers, err
}

func (r *repository) Update(volunteer *Volunteer) error {
	return r.db.Save(volunteer).Error
}

func (r *repository) Delete(id string) error {
	return r.db.Where("id = ?", id).Delete(&Volunteer{}).Error
}

func (r *repository) UpdateStatus(volunteerID string, status string, userID string, targetUserType string) error {
	return r.db.Transaction(func(tx *gorm.DB) error {
		if err := tx.Model(&Volunteer{}).Where("id = ?", volunteerID).Update("status", status).Error; err != nil {
			return err
		}
		if err := tx.Model(&user.User{}).Where("id = ?", userID).Update("user_type", targetUserType).Error; err != nil {
			return err
		}
		return nil
	})
}

