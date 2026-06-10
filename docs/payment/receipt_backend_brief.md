# Production-Grade NGO Document Management & Receipt Architecture (Go + Next.js)

This document outlines the production-ready backend architecture for generating, storing, and auditing NGO documents (Donation Receipts, 80G Tax Certificates, Donation Letters, etc.). 

It implements a **pragmatic, secure, and asynchronous hybrid model** tailored for a small-team NGO platform, ensuring auditability and security without enterprise over-engineering.

---

## 1. System Sequence Flow

```
              [PhonePe Webhook / Verification Success]
                                 │
                                 ▼
                     1. Open Database Transaction
                                 │
                                 ▼
                     2. Insert Year Sequence (ON CONFLICT DO NOTHING)
                        Lock & Increment Sequence (SELECT FOR UPDATE)
                        Generate Unique Receipt ID (e.g. SCF/2026/000123)
                                 │
                                 ▼
                     3. Generate Secure Cryptorandom Verification Token (Immutable)
                                 │
                                 ▼
                     4. Create Strongly-Typed Snapshot Record
                        (Lock donor, organization, and payment data at success time)
                                 │
                                 ▼
                     5. Insert Document Entry (State: PENDING, VerificationToken: <Token>)
                        - Enforce DB Constraint UNIQUE(payment_id, type) for webhook idempotency
                                 │
                                 ▼
                     6. Commit Database Transaction & Close Connection
                                 │
                                 ▼
                     7. Enqueue Background Task via Asynq: "document:generate"
                                 │
                                 ▼
                    [Asynq Worker: document:generate]
                     - Transactionally lock job: PENDING -> PROCESSING (Lease-locked for 15 mins)
                     - Render HTML (via Chromedp) using the pre-saved VerificationToken
                     - Generate SHA256 Hash of PDF
                     - Upload PDF to private path: receipts/YYYY/MM/<uuid>.pdf 
                       (With Content-Disposition friendly filename)
                     - Update Document (State: ACTIVE, Hash, Key)
                     - Enqueue next Asynq task: "document:email"
                                 │
                                 ▼
                     [Asynq Worker: document:email]
                     - Fetch PDF from private R2
                     - Send SMTP email with PDF attachment
```

---

## 2. Database Schema (GORM)

We split **Document metadata**, **Typed Snapshots**, **Sequencing**, and **Audit Logs** into dedicated tables.

### Critical Database Integrity Rules
1. **Audit Defensibility (No Soft Delete)**: We **do not** use soft deletes (`gorm.DeletedAt`) for documents. If a receipt requires correction or cancellation, the record must transition to `State = VOIDED`. The record must remain in the database under its original receipt number for tax audit compliance.
2. **Idempotency Index**: Enforce `UNIQUE(payment_id, type)` on the `documents` table to prevent duplicate generation requests when the payment gateway retries webhooks.
3. **Immutable Document Numbers**: The `document_number` unique index must be a standard index. Once a document number is generated, it can never be reused.
4. **Foreign Key Constraints**: Explicit database constraints are configured using GORM struct tags to prevent orphaned logs or snapshots.
5. **PII Snapshot immutability**: Once created, `ReceiptSnapshot` must never be modified or deleted. 

```go
package document

import (
	"time"
	"github.com/google/uuid"
)

type DocumentType string

const (
	DocTypeReceipt           DocumentType = "RECEIPT"
	DocTypeTaxCertificate80G DocumentType = "TAX_CERTIFICATE_80G"
	DocTypeDonationLetter    DocumentType = "DONATION_LETTER"
)

type DocumentState string

const (
	DocStatePending    DocumentState = "PENDING"
	DocStateProcessing DocumentState = "PROCESSING"
	DocStateActive     DocumentState = "ACTIVE"
	DocStateVoided     DocumentState = "VOIDED"
	DocStateFailed     DocumentState = "FAILED"
)

// Document tracks file links, hashes, and overall document lifecycle (No soft delete)
type Document struct {
	ID                uuid.UUID      `gorm:"type:uuid;default:gen_random_uuid();primaryKey" json:"id"`
	PaymentID         uuid.UUID      `gorm:"type:uuid;index;uniqueIndex:idx_payment_type;not null" json:"paymentId"` // Composite unique constraint for webhook idempotency
	Type              DocumentType   `gorm:"type:varchar(50);uniqueIndex:idx_payment_type;not null" json:"type"`
	State             DocumentState  `gorm:"type:varchar(50);not null;default:'PENDING'" json:"state"`
	DocumentNumber    string         `gorm:"type:varchar(100);uniqueIndex;not null" json:"documentNumber"` // e.g. SCF/2026/000123
	VerificationToken string         `gorm:"type:varchar(64);uniqueIndex;not null" json:"-"` // Cryptographically secure random token (stored hex)
	
	// Private Storage (Non-public links)
	S3Key             string         `gorm:"type:varchar(500);null" json:"-"`
	FileHash          string         `gorm:"type:varchar(64);null" json:"fileHash"` // SHA256 checksum
	
	// Relations (Enforce database-level referential integrity)
	SnapshotID        uuid.UUID      `gorm:"type:uuid;not null" json:"snapshotId"`
	Snapshot          ReceiptSnapshot `gorm:"foreignKey:SnapshotID;constraint:OnUpdate:CASCADE,OnDelete:RESTRICT" json:"snapshot,omitempty"`

	// Lock lease & Failure state logging
	ProcessingStartedAt *time.Time   `gorm:"index" json:"processingStartedAt,omitempty"` // Protects against stuck PROCESSING state
	FailureReason       string       `gorm:"type:text" json:"failureReason,omitempty"`

	CreatedAt         time.Time      `json:"createdAt"`
	UpdatedAt         time.Time      `json:"updatedAt"`
}

func (Document) TableName() string {
	return "documents"
}

// ReceiptSnapshot freezes the PII and NGO metadata at transaction success time
type ReceiptSnapshot struct {
	ID                   uuid.UUID      `gorm:"type:uuid;default:gen_random_uuid();primaryKey" json:"id"`
	
	// Donor Snapshot
	DonorName            string         `gorm:"type:varchar(255);not null" json:"donorName"`
	DonorEmail           string         `gorm:"type:varchar(255);not null" json:"donorEmail"`
	DonorPAN             string         `gorm:"type:varchar(10);null" json:"donorPan"`
	DonorPhone           string         `gorm:"type:varchar(50);null" json:"donorPhone"`
	DonorAddress         string         `gorm:"type:text;null" json:"donorAddress"`
	
	// NGO Organization Snapshot (Ensures historical validity)
	NgoName              string         `gorm:"type:varchar(255);not null" json:"ngoName"`
	NgoPAN               string         `gorm:"type:varchar(10);not null" json:"ngoPan"`
	NgoAddress           string         `gorm:"type:text;not null" json:"ngoAddress"`
	Ngo80GRegNo          string         `gorm:"type:varchar(100);null" json:"ngo80gRegNo"`
	Ngo80GValidity       string         `gorm:"type:varchar(100);null" json:"ngo80gValidity"` // Validity range snapshot
	Ngo12ARegNo          string         `gorm:"type:varchar(100);null" json:"ngo12aRegNo"`
	Ngo12AValidity       string         `gorm:"type:varchar(100);null" json:"ngo12aValidity"` // Validity range snapshot
	
	// Payment Snapshot
	Amount               int64          `gorm:"not null" json:"amount"` // in paise
	PaymentMethod        string         `gorm:"type:varchar(50);not null" json:"paymentMethod"`
	TransactionID        string         `gorm:"type:varchar(255);not null" json:"transactionId"`
	PaymentDate          time.Time      `json:"paymentDate"`
	
	CreatedAt            time.Time      `json:"createdAt"`
}

// ReceiptSequence guarantees collision-free sequential generation
type ReceiptSequence struct {
	Year        int    `gorm:"primaryKey;autoIncrement:false"`
	LastValue   int64  `gorm:"not null;default:0"`
	UpdatedAt   time.Time
}

// DocumentAuditLog tracks core operations (No soft delete)
type DocumentAuditLog struct {
	ID          uuid.UUID `gorm:"type:uuid;default:gen_random_uuid();primaryKey"`
	DocumentID  uuid.UUID `gorm:"type:uuid;index;not null;constraint:OnUpdate:CASCADE,OnDelete:RESTRICT"`
	Action      string    `gorm:"type:varchar(50);not null"` // CREATED, EMAILED, VOIDED, REGENERATED
	PerformedBy string    `gorm:"type:varchar(255);not null"` // "SYSTEM" or user UUID
	IPAddress   string    `gorm:"type:varchar(45);null"`
	UserAgent   string    `gorm:"type:text;null"`
	CreatedAt   time.Time
}
```

---

## 3. Concurrency-Safe Receipt Number & Secure Token Generation (Phase 1)

During the webhook/payment confirmation transaction (before enqueuing the background task), we:
1. Lock and increment the receipt sequence counter (using `Asia/Kolkata` location context).
2. Generate the cryptographically secure unguessable verification token.
3. Save both to the database, ensuring the token is locked as immutable metadata before PDF compilation begins.

```go
package document

import (
	"crypto/rand"
	"encoding/hex"
	"fmt"
	"time"
	"gorm.io/gorm"
	"gorm.io/gorm/clause"
)

// GenerateNextReceiptNumber obtains a thread-safe sequential ID inside an active transaction (IST aligned)
func GenerateNextReceiptNumber(tx *gorm.DB, prefix string) (string, error) {
	loc, err := time.LoadLocation("Asia/Kolkata")
	var now time.Time
	if err == nil {
		now = time.Now().In(loc)
	} else {
		now = time.Now().In(time.FixedZone("IST", 5.5*3600))
	}

	currentYear := now.Year()
	if now.Month() < time.April {
		currentYear = currentYear - 1
	}

	err = tx.Exec("INSERT INTO receipt_sequences (year, last_value, updated_at) VALUES (?, 0, ?) ON CONFLICT DO NOTHING", currentYear, time.Now()).Error
	if err != nil {
		return "", err
	}

	var seq ReceiptSequence
	err = tx.Clauses(clause.Locking{Strength: "UPDATE"}).
		Where("year = ?", currentYear).
		First(&seq).Error
	if err != nil {
		return "", err
	}

	seq.LastValue++
	seq.UpdatedAt = time.Now()
	if err := tx.Save(&seq).Error; err != nil {
		return "", err
	}

	return fmt.Sprintf("%s/%d/%06d", prefix, currentYear, seq.LastValue), nil
}

// CreatePendingDocument creates the pending document record with pre-saved cryptotoken
func CreatePendingDocument(tx *gorm.DB, paymentID uuid.UUID, docNumber string, docType DocumentType, snapshotID uuid.UUID) (*Document, error) {
	tokenBytes := make([]byte, 32)
	if _, err := rand.Read(tokenBytes); err != nil {
		return nil, err
	}
	
	doc := &Document{
		PaymentID:         paymentID,
		Type:              docType,
		State:             DocStatePending,
		DocumentNumber:    docNumber,
		VerificationToken: hex.EncodeToString(tokenBytes),
		SnapshotID:        snapshotID,
	}

	if err := tx.Create(doc).Error; err != nil {
		return nil, err
	}
	return doc, nil
}
```

---

## 4. Secure R2 Integration (Private Bucket + Friendly Filenames)

PII is protected. The bucket is **Private**. Next.js frontend downloads use temporary **Presigned URLs** (valid for 15 minutes) generated by the Go backend on demand. We set the `ContentDisposition` headers to provide a user-friendly filename when downloading.

```go
package storage

import (
	"context"
	"bytes"
	"crypto/sha256"
	"fmt"
	"time"
	"github.com/aws/aws-sdk-go-v2/aws"
	"github.com/aws/aws-sdk-go-v2/config"
	"github.com/aws/aws-sdk-go-v2/credentials"
	"github.com/aws/aws-sdk-go-v2/service/s3"
)

type R2Client struct {
	s3Client   *s3.Client
	presignClient *s3.PresignClient
	bucketName string
}

func NewR2Client(accountID, accessKey, secretKey, bucketName string) (*R2Client, error) {
	r2Endpoint := fmt.Sprintf("https://%s.r2.cloudflarestorage.com", accountID)

	cfg, err := config.LoadDefaultConfig(context.TODO(),
		config.WithEndpointResolverWithOptions(aws.EndpointResolverWithOptionsFunc(
			func(service, region string, options ...interface{}) (aws.Endpoint, error) {
				return aws.Endpoint{URL: r2Endpoint}, nil
			},
		)),
		config.WithCredentialsProvider(credentials.NewStaticCredentialsProvider(accessKey, secretKey, "")),
		config.WithRegion("auto"),
	)
	if err != nil {
		return nil, err
	}

	s3Client := s3.NewFromConfig(cfg)
	return &R2Client{
		s3Client:      s3Client,
		presignClient: s3.NewPresignClient(s3Client),
		bucketName:    bucketName,
	}, nil
}

// UploadPDF uploads the PDF bytes to R2
func (r *R2Client) UploadPDF(ctx context.Context, key, friendlyFilename string, pdfBytes []byte) (string, error) {
	hash := sha256.New()
	hash.Write(pdfBytes)
	sha256Sum := fmt.Sprintf("%x", hash.Sum(nil))

	contentDisposition := fmt.Sprintf("attachment; filename=\"%s\"", friendlyFilename)

	_, err := r.s3Client.PutObject(ctx, &s3.PutObjectInput{
		Bucket:             aws.String(r.bucketName),
		Key:                aws.String(key),
		Body:               bytes.NewReader(pdfBytes),
		ContentType:        aws.String("application/pdf"),
		ContentDisposition: aws.String(contentDisposition),
	})
	if err != nil {
		return "", err
	}

	return sha256Sum, nil
}

// GetPresignedURL generates temporary read links
func (r *R2Client) GetPresignedURL(ctx context.Context, key, friendlyFilename string, duration time.Duration) (string, error) {
	contentDisposition := fmt.Sprintf("attachment; filename=\"%s\"", friendlyFilename)

	req, err := r.presignClient.PresignGetObject(ctx, &s3.GetObjectInput{
		Bucket:             aws.String(r.bucketName),
		Key:                aws.String(key),
		ResponseContentDisposition: aws.String(contentDisposition),
	}, s3.WithPresignExpires(duration))
	if err != nil {
		return "", fmt.Errorf("failed to presign URL: %w", err)
	}
	return req.URL, nil
}
```

---

## 5. Background Task Management & Asynq Worker Execution

We use [Asynq](https://github.com/hibiken/asynq) for queue execution. It manages automatic retries, dead-letter queues, and concurrency out-of-the-box.

### Enqueuing PDF Task
```go
package payment

import (
	"encoding/json"
	"github.com/hibiken/asynq"
)

type DocumentPayload struct {
	DocumentID string `json:"document_id"`
}

func EnqueueDocumentGeneration(client *asynq.Client, docID string) error {
	payload, err := json.Marshal(DocumentPayload{DocumentID: docID})
	if err != nil {
		return err
	}
	task := asynq.NewTask("document:generate", payload)
	_, err = client.Enqueue(task)
	return err
}
```

### Background Worker Handler & Job Idempotency
```go
package payment

import (
	"context"
	"encoding/json"
	"fmt"
	"time"
	"github.com/hibiken/asynq"
	"gorm.io/gorm"
)

type DocumentHandler struct {
	db       *gorm.DB
	r2Client *storage.R2Client
}

func (h *DocumentHandler) ProcessTask(ctx context.Context, t *asynq.Task) error {
	var p DocumentPayload
	if err := json.Unmarshal(t.Payload(), &p); err != nil {
		return fmt.Errorf("invalid payload: %w", err)
	}

	// 1. Transactional State Lock & Lease Check
	// This protects against stuck processing locks (if a previous worker crashed mid-generation)
	var doc Document
	err := h.db.Transaction(func(tx *gorm.DB) error {
		var d Document
		if err := tx.Set("gorm:query_option", "FOR UPDATE").First(&d, "id = ?", p.DocumentID).Error; err != nil {
			return err
		}
		
		now := time.Now()
		
		// Guard: If job is already active, exit early (Idempotent exit)
		if d.State == DocStateActive {
			return fmt.Errorf("document already active") 
		}
		
		// Guard: If job is processing, check lease expiry (15 mins)
		if d.State == DocStateProcessing {
			if d.ProcessingStartedAt != nil && time.Since(*d.ProcessingStartedAt) < 15*time.Minute {
				return fmt.Errorf("document currently locked by active worker")
			}
			// Lease expired, takeover lock
		}
		
		d.State = DocStateProcessing
		d.ProcessingStartedAt = &now
		return tx.Save(&d).Error
	})
	
	if err != nil {
		// Return nil to let Asynq mark task successful since the document is either already active 
		// or is being processed by another active worker.
		return nil 
	}

	// Fetch loaded record (Unscoped to verify all documents)
	if err := h.db.Preload("Snapshot").First(&doc, "id = ?", p.DocumentID).Error; err != nil {
		h.handleFailure(ctx, p.DocumentID, err)
		return err
	}

	// 2. Generate PDF stream via Chromedp (Using pre-saved VerificationToken)
	pdfBytes, err := GenerateReceiptPDFStream(doc)
	if err != nil {
		h.handleFailure(ctx, doc.ID.String(), err)
		return err
	}

	// 3. Date-partitioned object key strategy (e.g. receipts/2026/06/doc-uuid.pdf)
	now := time.Now()
	r2Key := fmt.Sprintf("receipts/%d/%02d/%s.pdf", now.Year(), now.Month(), doc.ID.String())
	friendlyFilename := fmt.Sprintf("%s.pdf", strings.ReplaceAll(doc.DocumentNumber, "/", "-"))

	// 4. Upload to private R2 bucket
	fileHash, err := h.r2Client.UploadPDF(ctx, r2Key, friendlyFilename, pdfBytes)
	if err != nil {
		h.handleFailure(ctx, doc.ID.String(), err)
		return err
	}

	// 5. Complete Generation Loop
	err = h.db.Transaction(func(tx *gorm.DB) error {
		doc.State = DocStateActive
		doc.S3Key = r2Key
		doc.FileHash = fileHash
		if err := tx.Save(&doc).Error; err != nil {
			return err
		}
		
		audit := DocumentAuditLog{
			DocumentID:  doc.ID,
			Action:      "CREATED",
			PerformedBy: "SYSTEM",
		}
		return tx.Create(&audit).Error
	})
	if err != nil {
		return err
	}

	// 6. Enqueue Async Email Job (Decoupled task queue)
	return h.EnqueueEmailTask(doc.ID.String())
}

// handleFailure handles temporary retries and permanent failed states based on Asynq headers
func (h *DocumentHandler) handleFailure(ctx context.Context, docID string, err error) {
	retryCount, hasRetry := asynq.GetRetryCount(ctx)
	maxRetry, hasMax := asynq.GetMaxRetry(ctx)
	
	if hasRetry && hasMax && retryCount >= maxRetry {
		// Max retries exhausted! Mark state as FAILED permanently
		h.db.Model(&Document{}).Where("id = ?", docID).Updates(map[string]interface{}{
			"state":          DocStateFailed,
			"failure_reason": "Max retries exhausted: " + err.Error(),
		})
	} else {
		// Temporary failure. Reset state back to PENDING so other workers can retry it after backoff
		h.db.Model(&Document{}).Where("id = ?", docID).Updates(map[string]interface{}{
			"state":          DocStatePending,
			"failure_reason": "Attempt failed: " + err.Error(),
		})
	}
}
```

---

## 6. Secure Public Verification Endpoint (PII Masking)

Auditors scanning the QR code land on a public Next.js route calling this backend endpoint. It returns verified details while hiding private personal records.

### Route definition: `GET /api/documents/verify/:token`
```go
package document

import (
	"net/http"
	"strings"
	"github.com/gin-gonic/gin"
)

func VerifyDocumentHandler(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		token := c.Param("token")
		if token == "" || len(token) != 64 {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid verification token"})
			return
		}

		var doc Document
		// Query using token (Unscoped to verify even voided documents)
		err := db.Unscoped().Preload("Snapshot").First(&doc, "verification_token = ?", token).Error
		if err != nil {
			c.JSON(http.StatusNotFound, gin.H{"status": "UNVERIFIED", "message": "No matching record found"})
			return
		}

		// Mask PII values for public rendering
		maskedName := maskString(doc.Snapshot.DonorName, 2, 2)
		maskedPAN := maskString(doc.Snapshot.DonorPAN, 2, 3)
		maskedPhone := maskString(doc.Snapshot.DonorPhone, 2, 3)

		c.JSON(http.StatusOK, gin.H{
			"status":            "VERIFIED",
			"documentState":     doc.State, // ACTIVE or VOIDED
			"documentNumber":    doc.DocumentNumber,
			"issueDate":         doc.Snapshot.CreatedAt.Format("02-Jan-2006"),
			"amountInINR":       float64(doc.Snapshot.Amount) / 100.0,
			"donorMaskedName":   maskedName,
			"donorMaskedPan":    maskedPAN,
			"donorMaskedPhone":  maskedPhone,
			"organizationName":  doc.Snapshot.NgoName,
			"organization80G":   doc.Snapshot.Ngo80GRegNo,
			"organization12A":   doc.Snapshot.Ngo12ARegNo,
			"sha256Checksum":    doc.FileHash,
		})
	}
}

// maskString replaces middle characters of sensitive fields with asterisks
func maskString(s string, startKeep, endKeep int) string {
	if len(s) <= (startKeep + endKeep) {
		return "***"
	}
	start := s[:startKeep]
	end := s[len(s)-endKeep:]
	middle := strings.Repeat("*", len(s)-(startKeep+endKeep))
	return start + middle + end
}
```

---

## 7. Next.js Frontend Download Integration

Since files are stored securely in a private Cloudflare R2 bucket:

1. When a donor clicks **"Download Receipt"**, the frontend requests: `GET /api/payments/receipt/:id/download`.
2. The Go backend verifies user session authentication.
3. The Go backend generates a presigned URL using R2 Client: `R2Client.GetPresignedURL(ctx, doc.S3Key, 15 * time.Minute)`.
4. The Go backend redirects (HTTP 302) directly to the temporary, secure presigned R2 URL.
5. The browser securely downloads the PDF. The link automatically expires in 15 minutes.
