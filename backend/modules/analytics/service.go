package analytics

import (
	"context"
)

type Service interface {
	GetOperationalSummary(ctx context.Context) (*OperationalSummaryResponse, error)
}

type service struct {
	repo Repository
}

func NewService(repo Repository) Service {
	return &service{repo: repo}
}

func (s *service) GetOperationalSummary(ctx context.Context) (*OperationalSummaryResponse, error) {
	regGrowth, err := s.repo.GetRegistrationGrowth(ctx)
	if err != nil {
		return nil, err
	}

	donGrowth, err := s.repo.GetDonationGrowth(ctx)
	if err != nil {
		return nil, err
	}

	volAct, err := s.repo.GetVolunteerActivity(ctx)
	if err != nil {
		return nil, err
	}

	receipts, err := s.repo.GetReceiptStats(ctx)
	if err != nil {
		return nil, err
	}

	if regGrowth == nil {
		regGrowth = []RegistrationGrowth{}
	}
	if donGrowth == nil {
		donGrowth = []DonationGrowth{}
	}
	if volAct == nil {
		volAct = []VolunteerActivity{}
	}

	return &OperationalSummaryResponse{
		RegistrationGrowth: regGrowth,
		DonationGrowth:     donGrowth,
		VolunteerActivity:  volAct,
		ReceiptStats:       *receipts,
	}, nil
}
