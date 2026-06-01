package event

import (
	"context"
	"errors"

	"backend/dto/request"
	"backend/pkg/cloudinary"
	"backend/pkg/utils"

	"github.com/google/uuid"
)

type Service interface {
	CreateEvent(req *request.CreateEvent) (*Event, error)
	GetEvent(id string) (*Event, error)
	GetAllEvents(eventType string, pagination *utils.Pagination) ([]Event, error)
	UpdateEvent(id string, req *request.UpdateEvent) (*Event, error)
	UpdateEventImage(ctx context.Context, id string, url string, publicID string) error
	DeleteEvent(ctx context.Context, id string) error

	RegisterForEvent(eventID, userID string) error
	GetUsersByEventID(eventID string) ([]EventRegistration, error)
	GetEventsByUserID(userID string) ([]EventRegistration, error)
}

type service struct {
	repo Repository
}

func NewService(repo Repository) Service {
	return &service{repo: repo}
}

func (s *service) CreateEvent(req *request.CreateEvent) (*Event, error) {
	category := req.Category
	if category == "" {
		category = "Community"
	}
	ctaText := req.CtaText
	if ctaText == "" {
		ctaText = "Register Now"
	}
	eventType := req.EventType
	if eventType == "" {
		eventType = string(EventEventType)
	}

	event := &Event{
		EventName:      req.EventName,
		EventType:      EventType(eventType),
		EventDate:      req.EventDate,
		EventAddress:   req.EventAddress,
		OrganizerName:  req.OrganizerName,
		OrganizerPhone: req.OrganizerPhone,
		Description:    req.Description,
		Category:       category,
		CtaText:        ctaText,
	}

	if err := s.repo.Create(event); err != nil {
		return nil, err
	}

	return event, nil
}

func (s *service) GetEvent(id string) (*Event, error) {
	return s.repo.FindByID(id)
}

func (s *service) GetAllEvents(eventType string, pagination *utils.Pagination) ([]Event, error) {
	return s.repo.FindAll(eventType, pagination)
}

func (s *service) UpdateEvent(id string, req *request.UpdateEvent) (*Event, error) {
	event, err := s.repo.FindByID(id)
	if err != nil {
		return nil, errors.New("event not found")
	}

	if req.EventName != nil {
		event.EventName = *req.EventName
	}
	if req.EventType != nil {
		event.EventType = EventType(*req.EventType)
	}
	if req.EventDate != nil {
		event.EventDate = *req.EventDate
	}
	if req.EventAddress != nil {
		event.EventAddress = *req.EventAddress
	}
	if req.OrganizerName != nil {
		event.OrganizerName = *req.OrganizerName
	}
	if req.OrganizerPhone != nil {
		event.OrganizerPhone = *req.OrganizerPhone
	}
	if req.Description != nil {
		event.Description = *req.Description
	}
	if req.Category != nil {
		event.Category = *req.Category
	}
	if req.CtaText != nil {
		event.CtaText = *req.CtaText
	}

	if err := s.repo.Update(event); err != nil {
		return nil, err
	}

	return event, nil
}

func (s *service) UpdateEventImage(ctx context.Context, id string, url string, publicID string) error {
	event, err := s.repo.FindByID(id)
	if err != nil {
		return errors.New("event not found")
	}

	if event.ImagePublicID != nil && *event.ImagePublicID != "" {
		_ = cloudinary.DeleteImage(ctx, *event.ImagePublicID)
	}

	event.Image = &url
	event.ImagePublicID = &publicID

	return s.repo.Update(event)
}

func (s *service) DeleteEvent(ctx context.Context, id string) error {
	event, err := s.repo.FindByID(id)
	if err != nil {
		return errors.New("event not found")
	}

	// Delete from Cloudinary if image exists
	if event.ImagePublicID != nil && *event.ImagePublicID != "" {
		_ = cloudinary.DeleteImage(ctx, *event.ImagePublicID)
	}

	return s.repo.Delete(id)
}

func (s *service) RegisterForEvent(eventID, userID string) error {
	eID, err := uuid.Parse(eventID)
	if err != nil {
		return errors.New("invalid event ID")
	}
	uID, err := uuid.Parse(userID)
	if err != nil {
		return errors.New("invalid user ID")
	}

	reg := &EventRegistration{
		EventID: eID,
		UserID:  uID,
	}

	return s.repo.CreateRegistration(reg)
}

func (s *service) GetUsersByEventID(eventID string) ([]EventRegistration, error) {
	return s.repo.FindUsersByEventID(eventID)
}

func (s *service) GetEventsByUserID(userID string) ([]EventRegistration, error) {
	return s.repo.FindEventsByUserID(userID)
}
