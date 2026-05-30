package volunteer

import (
	"context"
	"errors"

	"backend/dto/request"
	"backend/modules/user"
	"backend/pkg/cloudinary"
	"backend/pkg/utils"

	"github.com/google/uuid"
)

type Service interface {
	CreateVolunteer(req *request.CreateVolunteer) (*Volunteer, error)
	GetVolunteer(id string) (*Volunteer, error)
	GetAllVolunteers(search string, pagination *utils.Pagination) ([]Volunteer, error)
	UpdateVolunteer(id string, req *request.UpdateVolunteer) (*Volunteer, error)
	UpdateVolunteerImage(ctx context.Context, id string, url string, publicID string) error
	DeleteVolunteer(ctx context.Context, id string) error
}

type service struct {
	repo        Repository
	userService user.Service
}

func NewService(repo Repository, userService user.Service) Service {
	return &service{repo: repo, userService: userService}
}

func (s *service) CreateVolunteer(req *request.CreateVolunteer) (*Volunteer, error) {
	u, err := s.userService.GetUser(req.UserID)
	if err != nil {
		return nil, errors.New("user not found")
	}

	if u.TotalReferrals < 10 {
		return nil, errors.New("not eligible yet: total referrals must be at least 10")
	}

	if u.ReferralPaymentCount < 10 {
		return nil, errors.New("not eligible yet: at least 10 referred payments are required")
	}

	userID, err := uuid.Parse(req.UserID)
	if err != nil {
		return nil, errors.New("invalid user id format")
	}

	volunteer := &Volunteer{
		UserID:         userID,
		Name:           req.Name,
		Email:          req.Email,
		Phone:          req.Phone,
		AlternatePhone: req.AlternatePhone,
		Address:        req.Address,
		City:           req.City,
		District:       req.District,
		Pincode:        req.Pincode,
		Profession:     req.Profession,
		Experience:     req.Experience,
		IsPublicConsent: req.IsPublicConsent,
	}

	if err := s.repo.Create(volunteer); err != nil {
		return nil, err
	}

	return volunteer, nil
}

func (s *service) GetVolunteer(id string) (*Volunteer, error) {
	return s.repo.FindByID(id)
}

func (s *service) GetAllVolunteers(search string, pagination *utils.Pagination) ([]Volunteer, error) {
	return s.repo.FindAll(search, pagination)
}

func (s *service) UpdateVolunteer(id string, req *request.UpdateVolunteer) (*Volunteer, error) {
	volunteer, err := s.repo.FindByID(id)
	if err != nil {
		return nil, errors.New("volunteer not found")
	}

	if req.Name != nil {
		volunteer.Name = *req.Name
	}
	if req.Email != nil {
		volunteer.Email = *req.Email
	}
	if req.Phone != nil {
		volunteer.Phone = *req.Phone
	}
	if req.AlternatePhone != nil {
		volunteer.AlternatePhone = *req.AlternatePhone
	}
	if req.Address != nil {
		volunteer.Address = *req.Address
	}
	if req.City != nil {
		volunteer.City = *req.City
	}
	if req.District != nil {
		volunteer.District = *req.District
	}
	if req.Pincode != nil {
		volunteer.Pincode = *req.Pincode
	}
	if req.Profession != nil {
		volunteer.Profession = *req.Profession
	}
	if req.Experience != nil {
		volunteer.Experience = *req.Experience
	}
	if req.IsPublicConsent != nil {
		volunteer.IsPublicConsent = *req.IsPublicConsent
	}

	if err := s.repo.Update(volunteer); err != nil {
		return nil, err
	}

	return volunteer, nil
}

func (s *service) UpdateVolunteerImage(ctx context.Context, id string, url string, publicID string) error {
	volunteer, err := s.repo.FindByID(id)
	if err != nil {
		return errors.New("volunteer not found")
	}

	// Delete from Cloudinary if an old image exists
	if volunteer.ImagePublicID != nil && *volunteer.ImagePublicID != "" {
		_ = cloudinary.DeleteImage(ctx, *volunteer.ImagePublicID)
	}

	volunteer.Image = &url
	volunteer.ImagePublicID = &publicID

	return s.repo.Update(volunteer)
}

func (s *service) DeleteVolunteer(ctx context.Context, id string) error {
	volunteer, err := s.repo.FindByID(id)
	if err != nil {
		return errors.New("volunteer not found")
	}

	// Delete from Cloudinary if image exists
	if volunteer.ImagePublicID != nil && *volunteer.ImagePublicID != "" {
		_ = cloudinary.DeleteImage(ctx, *volunteer.ImagePublicID)
	}

	return s.repo.Delete(id)
}
