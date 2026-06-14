package user

import (
	"context"
	"errors"

	"backend/dto/request"
	"backend/dto/response"
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
	GetNonAdminUsers(search string, sort string, pagination *utils.Pagination) ([]User, error)
	SuspendUser(id string, suspend bool) error
	DeleteUser(id string) error
	GetUsersByReferralID(referralID string) ([]User, error)
	GetVolunteerByUserID(userID string) (*response.Volunteer, error)
	RecordSuccessfulPayment(userID string, amount float64) error
	GetDownlineNetwork(ctx context.Context, userID string, recursive bool, pagination *utils.Pagination) (*response.UserNetworkResponse, error)
	GetNetworkStats(ctx context.Context, userID string) (*response.UserNetworkStatsResponse, error)
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

	if user.IsSuspended {
		return nil, errors.New("your account has been suspended")
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

func (s *service) GetNonAdminUsers(search string, sort string, pagination *utils.Pagination) ([]User, error) {
	return s.repo.FindNonAdminUsers(search, sort, pagination)
}

func (s *service) SuspendUser(id string, suspend bool) error {
	user, err := s.repo.FindByID(id)
	if err != nil {
		return errors.New("user not found")
	}
	user.IsSuspended = suspend
	return s.repo.Update(user)
}

func (s *service) DeleteUser(id string) error {
	return s.repo.Delete(id)
}

func (s *service) GetUsersByReferralID(referralID string) ([]User, error) {
	return s.repo.FindByReferralID(referralID)
}

func (s *service) GetVolunteerByUserID(userID string) (*response.Volunteer, error) {
	return s.repo.FindVolunteerByUserID(userID)
}

func (s *service) RecordSuccessfulPayment(userID string, amount float64) error {
	return s.repo.RecordSuccessfulPayment(userID, amount)
}

func computeNetworkDonations(userID string, referralsMap map[string][]User, directDonations map[string]float64, cache map[string]float64) float64 {
	if val, exists := cache[userID]; exists {
		return val
	}
	sum := 0.0
	children := referralsMap[userID]
	for _, child := range children {
		childID := child.ID.String()
		sum += directDonations[childID]
		sum += computeNetworkDonations(childID, referralsMap, directDonations, cache)
	}
	cache[userID] = sum
	return sum
}

func buildDownline(parentID string, currentLevel int, maxLevel int, referralsMap map[string][]User, directDonations map[string]float64, cache map[string]float64, results *[]response.ReferralInfo) {
	children := referralsMap[parentID]
	for _, child := range children {
		childID := child.ID.String()
		netDonations := computeNetworkDonations(childID, referralsMap, directDonations, cache)

		*results = append(*results, response.ReferralInfo{
			ID:                    child.ID,
			Name:                  child.Name,
			Phone:                 child.Phone,
			Level:                 currentLevel,
			TotalDirectDonations:  child.TotalAmount,
			TotalNetworkDonations: netDonations,
			JoinedAt:              child.CreatedAt,
		})

		if maxLevel == -1 || currentLevel < maxLevel {
			buildDownline(childID, currentLevel+1, maxLevel, referralsMap, directDonations, cache, results)
		}
	}
}

func (s *service) GetDownlineNetwork(ctx context.Context, userID string, recursive bool, pagination *utils.Pagination) (*response.UserNetworkResponse, error) {
	users, err := s.repo.FindAllNonAdminUsers()
	if err != nil {
		return nil, err
	}

	referralsMap := make(map[string][]User)
	directDonations := make(map[string]float64)
	for _, u := range users {
		if u.ReferralID != nil && *u.ReferralID != "" {
			referralsMap[*u.ReferralID] = append(referralsMap[*u.ReferralID], u)
		}
		directDonations[u.ID.String()] = u.TotalAmount
	}

	cache := make(map[string]float64)
	var referrals []response.ReferralInfo

	maxLevel := 1
	if recursive {
		maxLevel = -1
	}

	buildDownline(userID, 1, maxLevel, referralsMap, directDonations, cache, &referrals)

	totalCount := int64(len(referrals))
	pagination.TotalRows = totalCount
	pagination.Calculate()

	var paginatedReferrals []response.ReferralInfo
	if pagination.Limit > 0 && totalCount > 0 {
		start := pagination.Offset
		end := pagination.Offset + pagination.Limit
		if start < int(totalCount) {
			if end > int(totalCount) {
				end = int(totalCount)
			}
			paginatedReferrals = referrals[start:end]
		}
	} else {
		paginatedReferrals = referrals
	}

	if paginatedReferrals == nil {
		paginatedReferrals = []response.ReferralInfo{}
	}

	return &response.UserNetworkResponse{
		UserID:    userID,
		Referrals: paginatedReferrals,
	}, nil
}

func (s *service) GetNetworkStats(ctx context.Context, userID string) (*response.UserNetworkStatsResponse, error) {
	users, err := s.repo.FindAllNonAdminUsers()
	if err != nil {
		return nil, err
	}

	referralsMap := make(map[string][]User)
	directDonations := make(map[string]float64)
	for _, u := range users {
		if u.ReferralID != nil && *u.ReferralID != "" {
			referralsMap[*u.ReferralID] = append(referralsMap[*u.ReferralID], u)
		}
		directDonations[u.ID.String()] = u.TotalAmount
	}

	directReferrals := referralsMap[userID]
	directCount := int64(len(directReferrals))
	directDonationsSum := 0.0
	for _, child := range directReferrals {
		directDonationsSum += child.TotalAmount
	}

	cache := make(map[string]float64)
	var referralsList []response.ReferralInfo
	buildDownline(userID, 1, -1, referralsMap, directDonations, cache, &referralsList)

	totalDownlineCount := int64(len(referralsList))
	totalNetworkDonationAmount := computeNetworkDonations(userID, referralsMap, directDonations, cache)

	return &response.UserNetworkStatsResponse{
		DirectReferralsCount:         directCount,
		TotalDownlineCount:           totalDownlineCount,
		DirectReferralDonationAmount: directDonationsSum,
		TotalNetworkDonationAmount:   totalNetworkDonationAmount,
	}, nil
}

