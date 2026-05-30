package event

import (
	"backend/pkg/utils"
	"gorm.io/gorm"
)

type Repository interface {
	Create(event *Event) error
	FindByID(id string) (*Event, error)
	FindAll(eventType string, pagination *utils.Pagination) ([]Event, error)
	Update(event *Event) error
	Delete(id string) error

	CreateRegistration(reg *EventRegistration) error
	FindUsersByEventID(eventID string) ([]EventRegistration, error)
	FindEventsByUserID(userID string) ([]EventRegistration, error)
}

type repository struct {
	db *gorm.DB
}

func NewRepository(db *gorm.DB) Repository {
	return &repository{db: db}
}

func (r *repository) Create(event *Event) error {
	return r.db.Create(event).Error
}

func (r *repository) FindByID(id string) (*Event, error) {
	var event Event
	err := r.db.Where("id = ?", id).First(&event).Error
	if err != nil {
		return nil, err
	}
	return &event, nil
}

func (r *repository) FindAll(eventType string, pagination *utils.Pagination) ([]Event, error) {
	var events []Event
	query := r.db.Model(&Event{})

	if eventType != "" {
		query = query.Where("event_type = ?", eventType)
	}

	if err := query.Count(&pagination.TotalRows).Error; err != nil {
		return nil, err
	}
	pagination.Calculate()

	err := query.Order("created_at desc").Limit(pagination.Limit).Offset(pagination.Offset).Find(&events).Error
	return events, err
}

func (r *repository) Update(event *Event) error {
	return r.db.Save(event).Error
}

func (r *repository) Delete(id string) error {
	return r.db.Where("id = ?", id).Delete(&Event{}).Error
}

func (r *repository) CreateRegistration(reg *EventRegistration) error {
	return r.db.Create(reg).Error
}

func (r *repository) FindUsersByEventID(eventID string) ([]EventRegistration, error) {
	var regs []EventRegistration
	err := r.db.Where("event_id = ?", eventID).Preload("User").Find(&regs).Error
	return regs, err
}

func (r *repository) FindEventsByUserID(userID string) ([]EventRegistration, error) {
	var regs []EventRegistration
	err := r.db.Where("user_id = ?", userID).Preload("Event").Find(&regs).Error
	return regs, err
}
