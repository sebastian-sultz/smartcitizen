package payment

import (
	"context"
	"errors"
	"fmt"
	"os"
	"strconv"
	"time"

	dtorequest "backend/dto/request"
	dtoresponse "backend/dto/response"

	"github.com/PhonePe/phonepe-pg-sdk-go/common/models"
	"github.com/PhonePe/phonepe-pg-sdk-go/common/types"
	"github.com/PhonePe/phonepe-pg-sdk-go/payments/v2/models/request"
	"github.com/PhonePe/phonepe-pg-sdk-go/payments/v2/standardcheckout"
	"github.com/google/uuid"
)

type Service interface {
	InitiatePayment(ctx context.Context, req dtorequest.InitiatePaymentRequest, userID *uuid.UUID) (*dtoresponse.InitiatePaymentResponse, error)
	HandleWebhook(ctx context.Context, authHeader string, responseBody []byte) error
	CheckPaymentStatus(ctx context.Context, orderID string) (*Payment, error)
	GetPaymentHistory(ctx context.Context, userID *string, page, limit int) ([]dtoresponse.Payment, int64, error)
	GetUserDonationStats(ctx context.Context, userID string) (*dtoresponse.UserDonationStatsResponse, error)
}

type service struct {
	repo        Repository
	client      *standardcheckout.StandardCheckoutClient
	webhookUser string
	webhookPass string
	frontendURL string
}

func NewService(repo Repository) Service {
	clientID := os.Getenv("PHONEPE_CLIENT_ID")
	clientSecret := os.Getenv("PHONEPE_CLIENT_SECRET")
	clientVerStr := os.Getenv("PHONEPE_CLIENT_VERSION")
	envStr := os.Getenv("PHONEPE_ENV")
	frontendURL := os.Getenv("FRONTEND_URL")
	webhookUser := os.Getenv("PHONEPE_WEBHOOK_USERNAME")
	webhookPass := os.Getenv("PHONEPE_WEBHOOK_PASSWORD")

	clientVersion := 1
	if v, err := strconv.Atoi(clientVerStr); err == nil {
		clientVersion = v
	}

	env := types.Production
	if envStr == "UAT" || envStr == "SANDBOX" || envStr == "" {
		env = types.Sandbox
	}

	shouldPublishEvents := env == types.Production

	client, err := standardcheckout.GetInstance(
		clientID,
		clientSecret,
		clientVersion,
		env,
		shouldPublishEvents,
	)
	if err != nil {
		// Log this instead of panic in real app, but for now it's okay
		fmt.Printf("failed to initialize phonepe client: %v\n", err)
	}

	return &service{
		repo:        repo,
		client:      client,
		webhookUser: webhookUser,
		webhookPass: webhookPass,
		frontendURL: frontendURL,
	}
}

func (s *service) InitiatePayment(ctx context.Context, req dtorequest.InitiatePaymentRequest, userID *uuid.UUID) (*dtoresponse.InitiatePaymentResponse, error) {
	merchantOrderID := uuid.New().String()

	payment := &Payment{
		UserID:          userID,
		MerchantOrderID: merchantOrderID,
		Amount:          req.Amount * 100, // convert INR to paise
		Status:          PaymentStatusPending,
		DonorName:       req.DonorName,
		DonorEmail:      req.DonorEmail,
		DonorPhone:      req.DonorPhone,
	}

	if err := s.repo.CreatePayment(ctx, payment); err != nil {
		return nil, err
	}

	redirectURL := fmt.Sprintf("%s/donation/status?transactionId=%s", s.frontendURL, merchantOrderID)

	msg := "Donation - " + merchantOrderID
	exp := int64(1800)

	payReq := request.NewStandardCheckoutPayRequest(
		merchantOrderID,
		payment.Amount,
		&redirectURL,
		&models.MetaInfo{},
		&msg,
		&exp,
		nil,
		nil,
		nil,
	)

	// Context timeout for external API call
	reqCtx, cancel := context.WithTimeout(ctx, 10*time.Second)
	defer cancel()

	payResp, err := s.client.Pay(reqCtx, payReq)
	if err != nil {
		payment.Status = PaymentStatusFailed
		s.repo.UpdatePayment(ctx, payment)
		return nil, fmt.Errorf("failed to initiate payment: %w", err)
	}

	return &dtoresponse.InitiatePaymentResponse{
		RedirectURL:     payResp.RedirectURL,
		MerchantOrderID: merchantOrderID,
	}, nil
}

func (s *service) HandleWebhook(ctx context.Context, authHeader string, responseBody []byte) error {
	callbackResponse, err := s.client.ValidateCallback(s.webhookUser, s.webhookPass, authHeader, string(responseBody))
	if err != nil {
		return fmt.Errorf("invalid webhook: %w", err)
	}

	if callbackResponse == nil {
		return errors.New("invalid webhook response data")
	}

	orderID := callbackResponse.Data.MerchantOrderID
	state := callbackResponse.Data.State

	payment, err := s.repo.GetPaymentByOrderID(ctx, orderID)
	if err != nil {
		return fmt.Errorf("payment not found: %w", err)
	}

	switch state {
	case "COMPLETED":
		payment.Status = PaymentStatusSuccess
	case "FAILED":
		payment.Status = PaymentStatusFailed
	case "PENDING":
		payment.Status = PaymentStatusPending
	default:
		payment.Status = PaymentStatusPending
	}

	return s.repo.UpdatePayment(ctx, payment)
}

func (s *service) CheckPaymentStatus(ctx context.Context, orderID string) (*Payment, error) {
	payment, err := s.repo.GetPaymentByOrderID(ctx, orderID)
	if err != nil {
		return nil, err
	}

	if payment.Status == PaymentStatusPending {
		reqCtx, cancel := context.WithTimeout(ctx, 10*time.Second)
		defer cancel()

		statusResp, err := s.client.GetOrderStatus(reqCtx, orderID)
		if err != nil || statusResp == nil {
			return payment, nil // return existing payment if status check fails temporarily
		}

		updated := false
		switch statusResp.State {
		case "COMPLETED":
			payment.Status = PaymentStatusSuccess
			updated = true
		case "FAILED":
			payment.Status = PaymentStatusFailed
			updated = true
		}

		if updated {
			s.repo.UpdatePayment(ctx, payment)
		}
	}

	return payment, nil
}

func (s *service) GetPaymentHistory(ctx context.Context, userID *string, page, limit int) ([]dtoresponse.Payment, int64, error) {
	payments, total, err := s.repo.ListPayments(ctx, userID, page, limit)
	if err != nil {
		return nil, 0, err
	}

	var resp []dtoresponse.Payment
	for _, p := range payments {
		resp = append(resp, dtoresponse.Payment{
			ID:                  p.ID,
			UserID:              p.UserID,
			MerchantOrderID:     p.MerchantOrderID,
			ProviderReferenceID: p.ProviderReferenceID,
			Amount:              p.Amount,
			Status:              string(p.Status),
			PaymentMethod:       p.PaymentMethod,
			DonorName:           p.DonorName,
			DonorEmail:          p.DonorEmail,
			DonorPhone:          p.DonorPhone,
			CreatedAt:           p.CreatedAt,
			UpdatedAt:           p.UpdatedAt,
		})
	}
	return resp, total, nil
}

func (s *service) GetUserDonationStats(ctx context.Context, userID string) (*dtoresponse.UserDonationStatsResponse, error) {
	stats, err := s.repo.GetUserDonationStats(ctx, userID)
	if err != nil {
		return nil, err
	}

	return &dtoresponse.UserDonationStatsResponse{
		LifetimeDonated:   float64(stats.LifetimeDonated) / 100,
		DonatedThisYear:   float64(stats.DonatedThisYear) / 100,
		DonatedLastMonth:  float64(stats.DonatedLastMonth) / 100,
		TotalTransactions: stats.TotalTransactions,
		AverageAmount:     float64(stats.AverageAmount) / 100,
	}, nil
}
