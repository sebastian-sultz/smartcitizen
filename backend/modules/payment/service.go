package payment

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"log"
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

	log.Printf("Initiating payment for OrderID: %s, Amount: %d", merchantOrderID, req.Amount)

	if err := s.repo.CreatePayment(ctx, payment); err != nil {
		log.Printf("Error creating payment record in DB: %v", err)
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

	log.Printf("Calling PhonePe Pay API for OrderID: %s", merchantOrderID)
	payResp, err := s.client.Pay(reqCtx, payReq)
	if err != nil {
		log.Printf("PhonePe Pay API call failed for OrderID %s: %v", merchantOrderID, err)
		payment.Status = PaymentStatusFailed
		s.repo.UpdatePayment(ctx, payment)
		return nil, fmt.Errorf("failed to initiate payment: %w", err)
	}

	log.Printf("PhonePe Pay API successful for OrderID: %s", merchantOrderID)
	return &dtoresponse.InitiatePaymentResponse{
		RedirectURL:     payResp.RedirectURL,
		MerchantOrderID: merchantOrderID,
	}, nil
}

func (s *service) HandleWebhook(ctx context.Context, authHeader string, responseBody []byte) error {
	log.Printf("Received Webhook from PhonePe")
	
	callbackResponse, err := s.client.ValidateCallback(s.webhookUser, s.webhookPass, authHeader, string(responseBody))
	if err != nil {
		log.Printf("Webhook validation failed: %v", err)
		return fmt.Errorf("invalid webhook: %w", err)
	}

	if callbackResponse == nil {
		log.Printf("Webhook validation returned nil data")
		return errors.New("invalid webhook response data")
	}

	orderID := callbackResponse.Data.MerchantOrderID
	state := callbackResponse.Data.State
	
	log.Printf("Webhook processed for OrderID: %s, State: %s", orderID, state)

	payment, err := s.repo.GetPaymentByOrderID(ctx, orderID)
	if err != nil {
		log.Printf("Payment not found for OrderID %s: %v", orderID, err)
		return fmt.Errorf("payment not found: %w", err)
	}

	respString := string(responseBody)
	payment.PhonepeResponse = &respString

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

	if err := s.repo.UpdatePayment(ctx, payment); err != nil {
		log.Printf("Failed to update payment status from webhook for OrderID %s: %v", orderID, err)
		return err
	}
	
	log.Printf("Successfully updated payment status for OrderID %s to %s via webhook", orderID, payment.Status)
	return nil
}

func (s *service) CheckPaymentStatus(ctx context.Context, orderID string) (*Payment, error) {
	log.Printf("Checking payment status for OrderID: %s", orderID)
	payment, err := s.repo.GetPaymentByOrderID(ctx, orderID)
	if err != nil {
		log.Printf("Payment not found for status check OrderID %s: %v", orderID, err)
		return nil, err
	}

	if payment.Status == PaymentStatusPending {
		log.Printf("Payment %s is still PENDING in DB, calling PhonePe GetOrderStatus API", orderID)
		reqCtx, cancel := context.WithTimeout(ctx, 10*time.Second)
		defer cancel()

		statusResp, err := s.client.GetOrderStatus(reqCtx, orderID)
		if err != nil || statusResp == nil {
			log.Printf("PhonePe GetOrderStatus API failed for OrderID %s: %v", orderID, err)
			return payment, nil // return existing payment if status check fails temporarily
		}

		// Save the JSON response
		if respBytes, err := json.Marshal(statusResp); err == nil {
			respString := string(respBytes)
			payment.PhonepeResponse = &respString
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
			log.Printf("Updating payment status for OrderID %s to %s via Status API", orderID, payment.Status)
			if err := s.repo.UpdatePayment(ctx, payment); err != nil {
				log.Printf("Failed to update payment status from API for OrderID %s: %v", orderID, err)
			}
		}
	} else {
		log.Printf("Payment %s already in terminal state %s, skipping API call", orderID, payment.Status)
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
			PhonepeResponse:     p.PhonepeResponse,
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
	return stats, nil
}
