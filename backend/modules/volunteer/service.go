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
	GetAllVolunteers(search string, onlyApproved bool, pagination *utils.Pagination) ([]Volunteer, error)
	UpdateVolunteer(id string, req *request.UpdateVolunteer) (*Volunteer, error)
	UpdateVolunteerImage(ctx context.Context, id string, url string, publicID string) error
	DeleteVolunteer(ctx context.Context, id string) error
	UpdateVolunteerStatus(ctx context.Context, id string, status VolunteerStatus) (*Volunteer, error)
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

	// Secure user profile immediately with the provided password
	if err := s.userService.SetPassword(req.UserID, req.Password); err != nil {
		return nil, err
	}

	userID, err := uuid.Parse(req.UserID)
	if err != nil {
		return nil, errors.New("invalid user id format")
	}

	volunteer := &Volunteer{
		UserID:          userID,
		Name:            req.Name,
		Email:           req.Email,
		Phone:           req.Phone,
		AlternatePhone:  req.AlternatePhone,
		Address:         req.Address,
		City:            req.City,
		District:        req.District,
		Pincode:         req.Pincode,
		Profession:      req.Profession,
		Experience:      req.Experience,
		IsPublicConsent: req.IsPublicConsent,
		Status:          VolunteerStatusPending,
	}

	if u.ProfilePhoto != nil {
		volunteer.Image = u.ProfilePhoto
	}
	if u.ProfilePhotoPublicID != nil {
		volunteer.ImagePublicID = u.ProfilePhotoPublicID
	}

	if err := s.repo.Create(volunteer); err != nil {
		return nil, err
	}

	return volunteer, nil
}

func (s *service) GetVolunteer(id string) (*Volunteer, error) {
	return s.repo.FindByID(id)
}

func (s *service) GetAllVolunteers(search string, onlyApproved bool, pagination *utils.Pagination) ([]Volunteer, error) {
	return s.repo.FindAll(search, onlyApproved, pagination)
}

func (s *service) UpdateVolunteer(id string, req *request.UpdateVolunteer) (*Volunteer, error) {
	volunteer, err := s.repo.FindByID(id)
	if err != nil {
		return nil, errors.New("volunteer not found")
	}

	if req.Name != nil {
		volunteer.Name = *req.Name
		if err := s.userService.UpdateName(volunteer.UserID.String(), *req.Name); err != nil {
			return nil, err
		}
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

	return s.userService.UpdateProfilePhoto(ctx, volunteer.UserID.String(), url, publicID)
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

func (s *service) UpdateVolunteerStatus(ctx context.Context, id string, status VolunteerStatus) (*Volunteer, error) {
	volunteer, err := s.repo.FindByID(id)
	if err != nil {
		return nil, errors.New("volunteer not found")
	}

	var targetUserType string
	if status == VolunteerStatusApproved {
		targetUserType = string(user.Volunteer)
	} else {
		targetUserType = string(user.Member)
	}

	if err := s.repo.UpdateStatus(id, string(status), volunteer.UserID.String(), targetUserType); err != nil {
		return nil, err
	}

	volunteer.Status = status
	return volunteer, nil
}
