package event

import (
	"context"
	"errors"

	"backend/dto/request"
	"backend/pkg/cloudinary"
)

type Service interface {
	CreateEvent(req *request.CreateEvent) (*Event, error)
	GetEvent(id string) (*Event, error)
	GetAllEvents() ([]Event, error)
	UpdateEvent(id string, req *request.UpdateEvent) (*Event, error)
	UpdateEventImage(ctx context.Context, id string, url string, publicID string) error
	DeleteEvent(ctx context.Context, id string) error
}

type service struct {
	repo Repository
}

func NewService(repo Repository) Service {
	return &service{repo: repo}
}

func (s *service) CreateEvent(req *request.CreateEvent) (*Event, error) {
	event := &Event{
		EventName:      req.EventName,
		EventDate:      req.EventDate,
		EventAddress:   req.EventAddress,
		OrganizerName:  req.OrganizerName,
		OrganizerPhone: req.OrganizerPhone,
		Description:    req.Description,
	}

	if err := s.repo.Create(event); err != nil {
		return nil, err
	}

	return event, nil
}

func (s *service) GetEvent(id string) (*Event, error) {
	return s.repo.FindByID(id)
}

func (s *service) GetAllEvents() ([]Event, error) {
	return s.repo.FindAll()
}

func (s *service) UpdateEvent(id string, req *request.UpdateEvent) (*Event, error) {
	event, err := s.repo.FindByID(id)
	if err != nil {
		return nil, errors.New("event not found")
	}

	if req.EventName != nil {
		event.EventName = *req.EventName
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
