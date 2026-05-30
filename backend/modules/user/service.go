package user

import (
	"context"
	"errors"

	"backend/dto/request"
	"backend/pkg/cloudinary"
	"backend/pkg/utils"

	"golang.org/x/crypto/bcrypt"
)

type Service interface {
	GetUser(id string) (*User, error)
	Register(req *request.RegisterUser) (*User, error)
	Login(req *request.LoginUser) (*User, error)
	ForgetPassword(req *request.ForgetPassword) error
	UpdateProfilePhoto(ctx context.Context, id string, url string, publicID string) error
	GetSystemStats() (int64, int64, int64, float64, error)
	GetNonAdminUsers(pagination *utils.Pagination) ([]User, error)
}

type service struct {
	repo Repository
}

func NewService(repo Repository) Service {
	return &service{repo: repo}
}

func (s *service) GetUser(id string) (*User, error) {
	return s.repo.FindByID(id)
}

func (s *service) Register(req *request.RegisterUser) (*User, error) {
	existingUser, _ := s.repo.FindByPhone(req.Phone)
	if existingUser != nil {
		return nil, errors.New("phone number already registered")
	}

	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
	if err != nil {
		return nil, err
	}

	user := &User{
		Name:         req.Name,
		Phone:        req.Phone,
		Password:     string(hashedPassword),
		ProfilePhoto: req.ProfilePhoto,
		ReferralID:   req.ReferralID,
		UserType:     Member,
	}

	if err := s.repo.Create(user); err != nil {
		return nil, err
	}

	return user, nil
}

func (s *service) Login(req *request.LoginUser) (*User, error) {
	user, err := s.repo.FindByPhone(req.Phone)
	if err != nil {
		return nil, errors.New("invalid credentials")
	}

	err = bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(req.Password))
	if err != nil {
		return nil, errors.New("invalid credentials")
	}

	return user, nil
}

func (s *service) ForgetPassword(req *request.ForgetPassword) error {
	user, err := s.repo.FindByPhone(req.Phone)
	if err != nil {
		return errors.New("user not found")
	}

	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(req.NewPassword), bcrypt.DefaultCost)
	if err != nil {
		return err
	}

	user.Password = string(hashedPassword)

	return s.repo.Update(user)
}

func (s *service) UpdateProfilePhoto(ctx context.Context, id string, url string, publicID string) error {
	user, err := s.repo.FindByID(id)
	if err != nil {
		return errors.New("user not found")
	}

	if user.ProfilePhotoPublicID != nil && *user.ProfilePhotoPublicID != "" {
		_ = cloudinary.DeleteImage(ctx, *user.ProfilePhotoPublicID)
	}

	user.ProfilePhoto = &url
	user.ProfilePhotoPublicID = &publicID

	return s.repo.Update(user)
}

func (s *service) GetSystemStats() (int64, int64, int64, float64, error) {
	return s.repo.GetSystemStats()
}

func (s *service) GetNonAdminUsers(pagination *utils.Pagination) ([]User, error) {
	return s.repo.FindNonAdminUsers(pagination)
}
