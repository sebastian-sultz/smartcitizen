package payment

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"log"
	"os"
	"strconv"
	"strings"
	"time"

	dtorequest "backend/dto/request"
	dtoresponse "backend/dto/response"
	"backend/modules/user"
	"backend/pkg/cloudinary"
	"backend/pkg/utils"

	"github.com/PhonePe/phonepe-pg-sdk-go/common/models"
	"github.com/PhonePe/phonepe-pg-sdk-go/common/types"
	"github.com/PhonePe/phonepe-pg-sdk-go/payments/v2/models/request"
	"github.com/PhonePe/phonepe-pg-sdk-go/payments/v2/standardcheckout"
	"github.com/google/uuid"
	"gorm.io/datatypes"
)

type Service interface {
	InitiatePayment(ctx context.Context, req dtorequest.InitiatePaymentRequest, userID *uuid.UUID) (*dtoresponse.InitiatePaymentResponse, error)
	HandleWebhook(ctx context.Context, authHeader string, responseBody []byte) error
	CheckPaymentStatus(ctx context.Context, orderID string) (*Payment, error)
	GetPaymentHistory(ctx context.Context, userID *string, pagination *utils.Pagination) ([]dtoresponse.Payment, error)
	GetUserDonationStats(ctx context.Context, userID string) (*dtoresponse.UserDonationStatsResponse, error)
	GetReceiptURL(ctx context.Context, transactionID string) (string, error)
	GetTaxCertificates(ctx context.Context, userID string) ([]dtoresponse.TaxCertificate, error)
}

type service struct {
	repo         Repository
	userService  user.Service
	client       *standardcheckout.StandardCheckoutClient
	webhookUser  string
	webhookPass  string
	frontendURL  string
}

func NewService(repo Repository, userService user.Service) Service {
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
		repo:         repo,
		userService:  userService,
		client:       client,
		webhookUser:  webhookUser,
		webhookPass:  webhookPass,
		frontendURL:  frontendURL,
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
		DonorPAN:        req.DonorPAN,
		DonorAddress:    req.DonorAddress,
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

	// PhonePe V2 Webhook sends the data in "payload", not "data", so SDK's CallbackResponse fails to parse the inner fields.
	// We parse it manually.
	var parsedBody struct {
		Payload struct {
			MerchantOrderId string `json:"merchantOrderId"`
			State           string `json:"state"`
		} `json:"payload"`
	}
	if err := json.Unmarshal(responseBody, &parsedBody); err != nil {
		log.Printf("Failed to unmarshal actual webhook body: %v", err)
		return fmt.Errorf("invalid webhook JSON: %w", err)
	}

	orderID := parsedBody.Payload.MerchantOrderId
	state := parsedBody.Payload.State
	
	log.Printf("Webhook processed for OrderID: %s, State: %s", orderID, state)

	payment, err := s.repo.GetPaymentByOrderID(ctx, orderID)
	if err != nil {
		log.Printf("Payment not found for OrderID %s: %v", orderID, err)
		return fmt.Errorf("payment not found: %w", err)
	}

	payment.PhonepeResponse = datatypes.JSON(responseBody)

	switch state {
	case "COMPLETED":
		if payment.Status != PaymentStatusSuccess {
			payment.Status = PaymentStatusSuccess
			s.processSuccessfulPayment(ctx, payment)
		}
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
			payment.PhonepeResponse = datatypes.JSON(respBytes)
		}

		updated := false
		switch statusResp.State {
		case "COMPLETED":
			if payment.Status != PaymentStatusSuccess {
				payment.Status = PaymentStatusSuccess
				if len(statusResp.PaymentDetails) > 0 {
					payment.PaymentMethod = string(statusResp.PaymentDetails[0].PaymentMode)
					payment.ProviderReferenceID = statusResp.PaymentDetails[0].TransactionID
				}
				s.processSuccessfulPayment(ctx, payment)
				updated = true
			}
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

func (s *service) GetPaymentHistory(ctx context.Context, userID *string, pagination *utils.Pagination) ([]dtoresponse.Payment, error) {
	payments, err := s.repo.ListPayments(ctx, userID, pagination)
	if err != nil {
		return nil, err
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
	return resp, nil
}

func (s *service) GetUserDonationStats(ctx context.Context, userID string) (*dtoresponse.UserDonationStatsResponse, error) {
	stats, err := s.repo.GetUserDonationStats(ctx, userID)
	if err != nil {
		return nil, err
	}
	return stats, nil
}

func (s *service) processSuccessfulPayment(ctx context.Context, payment *Payment) {
	if payment.UserID != nil {
		_ = s.userService.RecordSuccessfulPayment(payment.UserID.String(), float64(payment.Amount)/100.0)
	}

	// Fetch status from PhonePe if PaymentMethod or ProviderReferenceID is missing,
	// because webhooks might not contain them or might have failed to parse them.
	if payment.PaymentMethod == "" || payment.ProviderReferenceID == "" {
		log.Printf("Payment details missing for OrderID %s, fetching from PhonePe...", payment.MerchantOrderID)
		reqCtx, cancel := context.WithTimeout(ctx, 10*time.Second)
		defer cancel()
		statusResp, err := s.client.GetOrderStatus(reqCtx, payment.MerchantOrderID)
		if err == nil && statusResp != nil {
			if len(statusResp.PaymentDetails) > 0 {
				payment.PaymentMethod = string(statusResp.PaymentDetails[0].PaymentMode)
				payment.ProviderReferenceID = statusResp.PaymentDetails[0].TransactionID
				// Save/update the payment in the DB so these are persisted
				if err := s.repo.UpdatePayment(ctx, payment); err != nil {
					log.Printf("Failed to update payment details from processSuccessfulPayment: %v", err)
				}
			}
		} else {
			log.Printf("Failed to fetch order status from PhonePe for details: %v", err)
		}
	}

	_, err := s.repo.GetReceiptByPaymentID(ctx, payment.ID.String())
	if err == nil {
		return // Receipt already exists
	}

	receiptNumber, err := s.repo.GetNextReceiptNumber(ctx)
	if err != nil {
		log.Printf("Failed to generate receipt number for OrderID %s: %v", payment.MerchantOrderID, err)
		return
	}

	newReceipt := &Receipt{
		PaymentID:     payment.ID,
		ReceiptNumber: receiptNumber,
		CloudinaryURL: "", 
	}
	if err := s.repo.CreateReceipt(ctx, newReceipt); err != nil {
		log.Printf("Failed to create receipt record for OrderID %s: %v", payment.MerchantOrderID, err)
		return
	}

	go func(p *Payment, rNum string, rID string) {
		log.Printf("Generating PDF for Receipt: %s", rNum)
		
		receiptData := utils.ReceiptData{
			ReceiptNum:    rNum,
			CreatedAt:     p.CreatedAt,
			DonorName:     p.DonorName,
			DonorPAN:      p.DonorPAN,
			DonorPhone:    p.DonorPhone,
			DonorAddress:  p.DonorAddress,
			Amount:        float64(p.Amount) / 100.0,
			PaymentMethod: p.PaymentMethod,
			TransactionID: p.ProviderReferenceID,
		}

		pdfBytes, err := utils.GenerateReceiptPDF(receiptData)
		if err != nil {
			log.Printf("PDF generation failed for %s: %v", rNum, err)
			return
		}

		filename := fmt.Sprintf("receipts/%s", strings.ReplaceAll(rNum, "/", "-"))
		url, _, err := cloudinary.UploadPDF(context.Background(), pdfBytes, "receipts", filename)
		if err != nil {
			log.Printf("Upload failed for %s: %v", rNum, err)
			return
		}

		if err := s.repo.UpdateReceiptURL(context.Background(), rID, url); err != nil {
			log.Printf("Failed to update Receipt URL for %s: %v", rNum, err)
		} else {
			log.Printf("Successfully generated and uploaded receipt: %s", url)
		}
	}(payment, receiptNumber, newReceipt.ID.String())
}

func (s *service) GetReceiptURL(ctx context.Context, transactionID string) (string, error) {
	payment, err := s.repo.GetPaymentByOrderID(ctx, transactionID)
	if err != nil {
		return "", err
	}
	
	receipt, err := s.repo.GetReceiptByPaymentID(ctx, payment.ID.String())
	if err != nil {
		return "", err
	}
	
	return receipt.CloudinaryURL, nil
}

func (s *service) GetTaxCertificates(ctx context.Context, userID string) ([]dtoresponse.TaxCertificate, error) {
	payments, receipts, err := s.repo.GetSuccessfulPaymentsWithReceipts(ctx, userID)
	if err != nil {
		return nil, err
	}

	receiptMap := make(map[string]string)
	for _, r := range receipts {
		receiptMap[r.PaymentID.String()] = r.CloudinaryURL
	}

	var certs []dtoresponse.TaxCertificate
	for _, p := range payments {
		loc, _ := time.LoadLocation("Asia/Kolkata")
		if loc == nil {
			loc = time.Local
		}
		createdAtInIndia := p.CreatedAt.In(loc)
		year := createdAtInIndia.Year()
		var fy string
		if createdAtInIndia.Month() < time.April {
			fy = fmt.Sprintf("%d-%d", year-1, year)
		} else {
			fy = fmt.Sprintf("%d-%d", year, year+1)
		}

		downloadURL := receiptMap[p.ID.String()]
		status := "pending"
		if downloadURL != "" {
			status = "generated"
		}

		certs = append(certs, dtoresponse.TaxCertificate{
			ID:          p.ID.String(),
			FiscalYear:  fy,
			Amount:      float64(p.Amount) / 100.0,
			Status:      status,
			DownloadURL: downloadURL,
		})
	}

	return certs, nil
}
