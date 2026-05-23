package volunteer

import (
	"backend/pkg/utils"
	"gorm.io/gorm"
)

type Repository interface {
	Create(volunteer *Volunteer) error
	FindByID(id string) (*Volunteer, error)
	FindAll(search string, pagination *utils.Pagination) ([]Volunteer, error)
	Update(volunteer *Volunteer) error
	Delete(id string) error
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

func (r *repository) FindAll(search string, pagination *utils.Pagination) ([]Volunteer, error) {
	var volunteers []Volunteer
	query := r.db.Model(&Volunteer{})

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
