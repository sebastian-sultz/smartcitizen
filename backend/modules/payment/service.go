package payment

import (
	"context"
	"encoding/csv"
	"encoding/json"
	"errors"
	"fmt"
	"io"
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
	"github.com/johnfercher/maroto/v2/pkg/components/col"
	"github.com/johnfercher/maroto/v2/pkg/components/line"
	"github.com/johnfercher/maroto/v2/pkg/components/row"
	"github.com/johnfercher/maroto/v2/pkg/components/text"
	"github.com/johnfercher/maroto/v2/pkg/consts/align"
	"github.com/johnfercher/maroto/v2/pkg/consts/fontstyle"
	"github.com/johnfercher/maroto/v2/pkg/props"
	"gorm.io/datatypes"
)

type Service interface {
	InitiatePayment(ctx context.Context, req dtorequest.InitiatePaymentRequest, userID *uuid.UUID) (*dtoresponse.InitiatePaymentResponse, error)
	HandleWebhook(ctx context.Context, authHeader string, responseBody []byte) error
	CheckPaymentStatus(ctx context.Context, orderID string) (*Payment, error)
	GetPaymentHistory(ctx context.Context, filter dtorequest.PaymentFilter, pagination *utils.Pagination) ([]dtoresponse.Payment, error)
	GetUserDonationStats(ctx context.Context, userID string) (*dtoresponse.UserDonationStatsResponse, error)
	GetReceiptURL(ctx context.Context, transactionID string) (string, error)
	GetTaxCertificates(ctx context.Context, userID string) ([]dtoresponse.TaxCertificate, error)
	UpdateTaxDetails(ctx context.Context, transactionID string, donorPAN string, donorAddress string) error
	ExportPaymentsCSV(ctx context.Context, filter dtorequest.PaymentFilter, w io.Writer) error
	ExportPaymentsPDF(ctx context.Context, filter dtorequest.PaymentFilter) ([]byte, error)
	ExportForm10BDCSV(ctx context.Context, financialYear string, w io.Writer) error
	SyncPendingReceipts(ctx context.Context) (int, error)
}

type service struct {
	repo        Repository
	userService user.Service
	client      *standardcheckout.StandardCheckoutClient
	webhookUser string
	webhookPass string
	frontendURL string
}

func NewService(repo Repository, userService user.Service) Service {
	clientID := os.Getenv("PHONEPE_CLIENT_ID")
	clientSecret := os.Getenv("PHONEPE_CLIENT_SECRET")
	clientVerStr := os.Getenv("PHONEPE_CLIENT_VERSION")
	envStr := os.Getenv("PHONEPE_ENV")
	frontendURL := strings.TrimRight(strings.TrimSpace(os.Getenv("FRONTEND_URL")), "/")
	if frontendURL == "" {
		frontendURL = "http://localhost:3000"
	}
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
		userService: userService,
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
		DonorPAN:        req.DonorPAN,
		DonorAddress:    req.DonorAddress,
	}

	log.Printf("Initiating payment for OrderID: %s, Amount: %d", merchantOrderID, req.Amount)

	if err := s.repo.CreatePayment(ctx, payment); err != nil {
		log.Printf("Error creating payment record in DB: %v", err)
		return nil, err
	}

	redirectURL := fmt.Sprintf("%s/donation/status?transactionId=%s", strings.TrimRight(s.frontendURL, "/"), merchantOrderID)

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
			PaymentDetails  []struct {
				TransactionId string `json:"transactionId"`
				PaymentMode   string `json:"paymentMode"`
			} `json:"paymentDetails"`
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
	if len(parsedBody.Payload.PaymentDetails) > 0 {
		if parsedBody.Payload.PaymentDetails[0].TransactionId != "" {
			payment.ProviderReferenceID = parsedBody.Payload.PaymentDetails[0].TransactionId
		}
		if parsedBody.Payload.PaymentDetails[0].PaymentMode != "" {
			payment.PaymentMethod = parsedBody.Payload.PaymentDetails[0].PaymentMode
		}
	}

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

func (s *service) GetPaymentHistory(ctx context.Context, filter dtorequest.PaymentFilter, pagination *utils.Pagination) ([]dtoresponse.Payment, error) {
	payments, err := s.repo.ListPayments(ctx, filter, pagination)
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
			DonorPAN:            p.DonorPAN,
			DonorAddress:        p.DonorAddress,
			PhonepeResponse:     p.PhonepeResponse,
			ReceiptNumber:       p.ReceiptNumber,
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

	receiptIDStr := newReceipt.ID.String()
	payment.ReceiptID = &receiptIDStr
	if err := s.repo.UpdatePayment(ctx, payment); err != nil {
		log.Printf("Failed to update payment with receipt ID: %v", err)
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
		if payment.Status == PaymentStatusSuccess {
			s.processSuccessfulPayment(ctx, payment)
			receipt, err = s.repo.GetReceiptByPaymentID(ctx, payment.ID.String())
			if err != nil {
				return "", err
			}
		} else {
			return "", err
		}
	}

	// Generate a temporary signed URL dynamically for private file
	publicID := fmt.Sprintf("receipts/receipts/%s", strings.ReplaceAll(receipt.ReceiptNumber, "/", "-"))
	signedURL, err := cloudinary.GetPrivateURL(publicID)
	if err != nil || signedURL == "" {
		log.Printf("Failed to generate signed URL for receipt %s: %v", receipt.ReceiptNumber, err)
		return receipt.CloudinaryURL, nil // Fallback to raw stored URL
	}

	return signedURL, nil
}

func (s *service) GetTaxCertificates(ctx context.Context, userID string) ([]dtoresponse.TaxCertificate, error) {
	payments, receipts, err := s.repo.GetSuccessfulPaymentsWithReceipts(ctx, userID)
	if err != nil {
		return nil, err
	}

	receiptMap := make(map[string]Receipt)
	for _, r := range receipts {
		receiptMap[r.PaymentID.String()] = r
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

		downloadURL := ""
		status := "pending"
		if r, ok := receiptMap[p.ID.String()]; ok && r.CloudinaryURL != "" {
			status = "generated"
			// Generate a temporary signed URL dynamically for private file
			publicID := fmt.Sprintf("receipts/receipts/%s", strings.ReplaceAll(r.ReceiptNumber, "/", "-"))
			signedURL, err := cloudinary.GetPrivateURL(publicID)
			if err == nil {
				downloadURL = signedURL
			} else {
				log.Printf("Failed to generate signed URL for receipt %s: %v", r.ReceiptNumber, err)
				downloadURL = r.CloudinaryURL // Fallback to raw stored URL
			}
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

func (s *service) UpdateTaxDetails(ctx context.Context, transactionID string, donorPAN string, donorAddress string) error {
	payment, err := s.repo.GetPaymentByOrderID(ctx, transactionID)
	if err != nil {
		return fmt.Errorf("payment record not found: %w", err)
	}

	payment.DonorPAN = donorPAN
	payment.DonorAddress = donorAddress

	if err := s.repo.UpdatePayment(ctx, payment); err != nil {
		return fmt.Errorf("failed to update payment record: %w", err)
	}

	if payment.Status == PaymentStatusSuccess {
		if err := s.regenerateReceipt(ctx, payment); err != nil {
			return fmt.Errorf("failed to compile tax receipt: %w", err)
		}
	}

	return nil
}

func (s *service) regenerateReceipt(ctx context.Context, payment *Payment) error {
	receipt, err := s.repo.GetReceiptByPaymentID(ctx, payment.ID.String())
	var receiptNumber string
	var receiptID string

	if err != nil {
		receiptNumber, err = s.repo.GetNextReceiptNumber(ctx)
		if err != nil {
			return fmt.Errorf("failed to generate receipt number: %w", err)
		}
		newReceipt := &Receipt{
			PaymentID:     payment.ID,
			ReceiptNumber: receiptNumber,
		}
		if err := s.repo.CreateReceipt(ctx, newReceipt); err != nil {
			return fmt.Errorf("failed to create receipt record: %w", err)
		}
		receiptID = newReceipt.ID.String()

		payment.ReceiptID = &receiptID
		if err := s.repo.UpdatePayment(ctx, payment); err != nil {
			log.Printf("Failed to update payment with receipt ID: %v", err)
		}
	} else {
		receiptNumber = receipt.ReceiptNumber
		receiptID = receipt.ID.String()
	}

	log.Printf("Regenerating PDF for Receipt: %s due to tax info update", receiptNumber)

	receiptData := utils.ReceiptData{
		ReceiptNum:    receiptNumber,
		CreatedAt:     payment.CreatedAt,
		DonorName:     payment.DonorName,
		DonorPAN:      payment.DonorPAN,
		DonorPhone:    payment.DonorPhone,
		DonorAddress:  payment.DonorAddress,
		Amount:        float64(payment.Amount) / 100.0,
		PaymentMethod: payment.PaymentMethod,
		TransactionID: payment.ProviderReferenceID,
	}

	pdfBytes, err := utils.GenerateReceiptPDF(receiptData)
	if err != nil {
		return fmt.Errorf("PDF generation failed for %s: %w", receiptNumber, err)
	}

	filename := fmt.Sprintf("receipts/%s", strings.ReplaceAll(receiptNumber, "/", "-"))
	url, _, err := cloudinary.UploadPDF(ctx, pdfBytes, "receipts", filename)
	if err != nil {
		return fmt.Errorf("upload failed for %s: %w", receiptNumber, err)
	}

	if err := s.repo.UpdateReceiptURL(ctx, receiptID, url); err != nil {
		return fmt.Errorf("failed to update Receipt URL for %s: %w", receiptNumber, err)
	}

	log.Printf("Successfully regenerated and uploaded receipt: %s", url)
	return nil
}

func (s *service) ExportPaymentsCSV(ctx context.Context, filter dtorequest.PaymentFilter, w io.Writer) error {
	pagination := utils.Pagination{Limit: -1}
	payments, err := s.repo.ListPayments(ctx, filter, &pagination)
	if err != nil {
		return err
	}

	if _, err := w.Write([]byte("\xEF\xBB\xBF")); err != nil {
		return fmt.Errorf("failed to write UTF-8 BOM: %w", err)
	}

	writer := csv.NewWriter(w)
	defer writer.Flush()

	headers := []string{
		"Transaction ID / UTR", "Merchant Order ID", "Receipt Number", "Donor Name", "Email", "Phone", "PAN", "Address", "Amount (INR)", "Status", "Payment Mode", "Date Created",
	}
	if err := writer.Write(headers); err != nil {
		return err
	}

	for _, p := range payments {
		amountINR := fmt.Sprintf("%.2f", float64(p.Amount)/100.0)
		row := []string{
			p.ProviderReferenceID,
			p.MerchantOrderID,
			p.ReceiptNumber,
			p.DonorName,
			p.DonorEmail,
			p.DonorPhone,
			p.DonorPAN,
			p.DonorAddress,
			amountINR,
			string(p.Status),
			p.PaymentMethod,
			p.CreatedAt.Format("02 Jan 2006 15:04:05"),
		}
		for i, cell := range row {
			if len(cell) > 0 && (cell[0] == '=' || cell[0] == '+' || cell[0] == '-' || cell[0] == '@' || cell[0] == '\t' || cell[0] == '\r') {
				row[i] = "'" + cell
			}
		}
		if err := writer.Write(row); err != nil {
			return err
		}
	}

	return nil
}

func (s *service) ExportPaymentsPDF(ctx context.Context, filter dtorequest.PaymentFilter) ([]byte, error) {
	pagination := utils.Pagination{Limit: -1}
	payments, err := s.repo.ListPayments(ctx, filter, &pagination)
	if err != nil {
		return nil, fmt.Errorf("failed to list payments for PDF: %w", err)
	}

	m := utils.BuildPortraitMaroto()

	utils.AddAdminReportHeader(m, utils.AdminReportHeaderProps{
		Title:       "DONATIONS & FINANCIAL AUDIT REPORT",
		TotalCount:  len(payments),
		GeneratedAt: time.Now(),
	})

	totalCollections := 0.0
	successfulCount := 0
	for _, p := range payments {
		if p.Status == "SUCCESS" {
			successfulCount++
			totalCollections += float64(p.Amount) / 100.0
		}
	}

	avgDonation := 0.0
	if successfulCount > 0 {
		avgDonation = totalCollections / float64(successfulCount)
	}

	cardBg := &props.Color{Red: 248, Green: 250, Blue: 252}
	darkBlue := &props.Color{Red: 15, Green: 23, Blue: 42}
	emerald := &props.Color{Red: 16, Green: 185, Blue: 129}
	muted := &props.Color{Red: 100, Green: 116, Blue: 139}

	// Summary Statistics Row
	m.AddRows(
		row.New(10).Add(
			col.New(4).WithStyle(&props.Cell{BackgroundColor: cardBg}).Add(
				text.New("TOTAL COLLECTIONS", props.Text{Size: 6.5, Style: fontstyle.Bold, Color: muted, Top: 1}),
				text.New(fmt.Sprintf("Rs. %.2f", totalCollections), props.Text{Size: 9, Style: fontstyle.Bold, Color: darkBlue, Top: 4}),
			),
			col.New(4).WithStyle(&props.Cell{BackgroundColor: cardBg}).Add(
				text.New("SUCCESSFUL PAYMENTS", props.Text{Size: 6.5, Style: fontstyle.Bold, Color: muted, Top: 1}),
				text.New(fmt.Sprintf("%d transactions", successfulCount), props.Text{Size: 9, Style: fontstyle.Bold, Color: emerald, Top: 4}),
			),
			col.New(4).WithStyle(&props.Cell{BackgroundColor: cardBg}).Add(
				text.New("AVERAGE DONATION", props.Text{Size: 6.5, Style: fontstyle.Bold, Color: muted, Top: 1}),
				text.New(fmt.Sprintf("Rs. %.2f", avgDonation), props.Text{Size: 9, Style: fontstyle.Bold, Color: darkBlue, Top: 4}),
			),
		),
		row.New(3).Add(col.New(12)),
	)

	// Table Header
	headerBg := darkBlue
	headerFg := &props.Color{Red: 255, Green: 255, Blue: 255}

	m.AddRows(
		row.New(6.5).Add(
			col.New(3).WithStyle(&props.Cell{BackgroundColor: headerBg}).Add(
				text.New("DATE / RECEIPT NO", props.Text{Size: 7, Style: fontstyle.Bold, Color: headerFg, Top: 1.8}),
			),
			col.New(4).WithStyle(&props.Cell{BackgroundColor: headerBg}).Add(
				text.New("DONOR & PHONE", props.Text{Size: 7, Style: fontstyle.Bold, Color: headerFg, Top: 1.8}),
			),
			col.New(3).WithStyle(&props.Cell{BackgroundColor: headerBg}).Add(
				text.New("AMOUNT & MODE", props.Text{Size: 7, Style: fontstyle.Bold, Color: headerFg, Top: 1.8}),
			),
			col.New(2).WithStyle(&props.Cell{BackgroundColor: headerBg}).Add(
				text.New("UTR / STATUS", props.Text{Size: 7, Style: fontstyle.Bold, Color: headerFg, Top: 1.8, Align: align.Right}),
			),
		),
	)

	altBg := &props.Color{Red: 248, Green: 250, Blue: 252}
	whiteBg := &props.Color{Red: 255, Green: 255, Blue: 255}

	for i, p := range payments {
		bg := whiteBg
		if i%2 == 1 {
			bg = altBg
		}

		rNum := p.ReceiptNumber
		if rNum == "" {
			rNum = "No Receipt"
		}

		statusColor := emerald
		if p.Status == "FAILED" {
			statusColor = &props.Color{Red: 225, Green: 29, Blue: 72}
		} else if p.Status == "PENDING" {
			statusColor = &props.Color{Red: 234, Green: 179, Blue: 8}
		}

		m.AddRows(
			row.New(6).Add(
				col.New(3).WithStyle(&props.Cell{BackgroundColor: bg}).Add(
					text.New(p.CreatedAt.Format("02/01/2006 15:04"), props.Text{Size: 6.5, Style: fontstyle.Bold, Color: darkBlue, Top: 1}),
					text.New(rNum, props.Text{Size: 5.5, Color: muted, Top: 3.5}),
				),
				col.New(4).WithStyle(&props.Cell{BackgroundColor: bg}).Add(
					text.New(p.DonorName, props.Text{Size: 6.5, Style: fontstyle.Bold, Color: darkBlue, Top: 1}),
					text.New(p.DonorPhone, props.Text{Size: 5.5, Color: muted, Top: 3.5}),
				),
				col.New(3).WithStyle(&props.Cell{BackgroundColor: bg}).Add(
					text.New(fmt.Sprintf("Rs. %.2f", float64(p.Amount)/100.0), props.Text{Size: 6.5, Style: fontstyle.Bold, Color: darkBlue, Top: 1}),
					text.New(p.PaymentMethod, props.Text{Size: 5.5, Color: muted, Top: 3.5}),
				),
				col.New(2).WithStyle(&props.Cell{BackgroundColor: bg}).Add(
					text.New(string(p.Status), props.Text{Size: 6.5, Style: fontstyle.Bold, Color: statusColor, Align: align.Right, Top: 1}),
					text.New(p.ProviderReferenceID, props.Text{Size: 5.5, Color: muted, Align: align.Right, Top: 3.5}),
				),
			),
		)
	}

	// Footer line
	m.AddRows(
		row.New(6).Add(
			col.New(12).Add(
				line.New(props.Line{Color: &props.Color{Red: 203, Green: 213, Blue: 225}, Thickness: 0.5}),
				text.New("Global Smart Citizens Foundation - Financial Audit & 80G Statutory Ledger Document", props.Text{
					Size:  5.5,
					Color: muted,
					Top:   2,
					Align: align.Center,
				}),
			),
		),
	)

	document, err := m.Generate()
	if err != nil {
		return nil, fmt.Errorf("failed to render payments PDF: %w", err)
	}

	return document.GetBytes(), nil
}


func (s *service) ExportForm10BDCSV(ctx context.Context, financialYear string, w io.Writer) error {
	parts := strings.Split(financialYear, "-")
	if len(parts) != 2 {
		return errors.New("invalid financial year format, expected YYYY-YYYY")
	}

	startYear, err := strconv.Atoi(parts[0])
	if err != nil {
		return fmt.Errorf("invalid start year: %w", err)
	}
	endYear, err := strconv.Atoi(parts[1])
	if err != nil {
		return fmt.Errorf("invalid end year: %w", err)
	}

	loc, _ := time.LoadLocation("Asia/Kolkata")
	if loc == nil {
		loc = time.UTC
	}

	startDate := time.Date(startYear, time.April, 1, 0, 0, 0, 0, loc)
	endDate := time.Date(endYear, time.March, 31, 23, 59, 59, 999999999, loc)

	statusSuccess := "SUCCESS"
	taxExemptTrue := true
	startStr := startDate.Format(time.RFC3339)
	endStr := endDate.Format(time.RFC3339)

	filter := dtorequest.PaymentFilter{
		Status:       &statusSuccess,
		TaxExemption: &taxExemptTrue,
		StartDate:    &startStr,
		EndDate:      &endStr,
	}

	pagination := utils.Pagination{Limit: -1}
	payments, err := s.repo.ListPayments(ctx, filter, &pagination)
	if err != nil {
		return err
	}

	writer := csv.NewWriter(w)
	defer writer.Flush()

	headers := []string{
		"Serial Number", "Pre-acknowledgement Number", "ID Code", "Unique Identification Number", "Section Code", "Donation Type", "Mode of Receipt", "Amount of Donation (INR)",
	}
	if err := writer.Write(headers); err != nil {
		return err
	}

	for i, p := range payments {
		modeOfReceipt := "Others"
		pmLower := strings.ToLower(p.PaymentMethod)
		if strings.Contains(pmLower, "upi") || strings.Contains(pmLower, "card") || strings.Contains(pmLower, "netbanking") || strings.Contains(pmLower, "electronic") || strings.Contains(pmLower, "online") || strings.Contains(pmLower, "net banking") {
			modeOfReceipt = "Electronic"
		} else if strings.Contains(pmLower, "cash") {
			modeOfReceipt = "Cash"
		}

		amountINR := fmt.Sprintf("%.2f", float64(p.Amount)/100.0)

		row := []string{
			strconv.Itoa(i + 1),
			"",
			"1", // ID Code: 1 (PAN)
			p.DonorPAN,
			"Section 80G",
			"Others",
			modeOfReceipt,
			amountINR,
		}
		if err := writer.Write(row); err != nil {
			return err
		}
	}

	return nil
}

func (s *service) SyncPendingReceipts(ctx context.Context) (int, error) {
	payments, err := s.repo.GetPaymentsMissingReceipts(ctx)
	if err != nil {
		return 0, fmt.Errorf("failed to fetch payments missing receipts: %w", err)
	}

	if len(payments) == 0 {
		return 0, nil
	}

	successCount := 0
	for _, p := range payments {
		paymentCopy := p
		if err := s.regenerateReceipt(ctx, &paymentCopy); err != nil {
			log.Printf("Failed to sync receipt for OrderID %s: %v", p.MerchantOrderID, err)
		} else {
			successCount++
		}
	}

	return successCount, nil
}
