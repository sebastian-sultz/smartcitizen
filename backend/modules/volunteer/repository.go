package volunteer

import (
	"backend/modules/user"
	"backend/pkg/utils"

	"gorm.io/gorm"
)

type Repository interface {
	Create(volunteer *Volunteer) error
	FindByID(id string) (*Volunteer, error)
	FindAll(search string, onlyApproved bool, pagination *utils.Pagination) ([]Volunteer, error)
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
	return r.db.Create(volunteer).Error
}

func (r *repository) FindByID(id string) (*Volunteer, error) {
	var volunteer Volunteer
	err := r.db.Where("id = ?", id).First(&volunteer).Error
	if err != nil {
		return nil, err
	}
	return &volunteer, nil
}

func (r *repository) FindAll(search string, onlyApproved bool, pagination *utils.Pagination) ([]Volunteer, error) {
	var volunteers []Volunteer
	query := r.db.Model(&Volunteer{})

	if onlyApproved {
		query = query.Where("status = ? AND is_public_consent = ?", "APPROVED", true)
	}

	if search != "" {
		searchTerm := "%" + search + "%"
		query = query.Where("name ILIKE ? OR profession ILIKE ? OR experience ILIKE ? OR city ILIKE ? OR district ILIKE ? OR address ILIKE ?",
			searchTerm, searchTerm, searchTerm, searchTerm, searchTerm, searchTerm)
	}

	if err := query.Count(&pagination.TotalRows).Error; err != nil {
		return nil, err
	}
	pagination.Calculate()

	err := query.Order("created_at desc").Limit(pagination.Limit).Offset(pagination.Offset).Find(&volunteers).Error
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

