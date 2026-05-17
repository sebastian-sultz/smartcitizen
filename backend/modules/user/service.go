package user

import (
	"errors"

	"backend/dto/request"
	"golang.org/x/crypto/bcrypt"
)

type Service interface {
	Register(req *request.RegisterUser) (*User, error)
	Login(req *request.LoginUser) (*User, error)
}

type service struct {
	repo Repository
}

func NewService(repo Repository) Service {
	return &service{repo: repo}
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
