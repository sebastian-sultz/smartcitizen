package report

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type ReportStatus string

const (
	StatusOpen     ReportStatus = "Open"
	StatusResolved ReportStatus = "Resolved"
	StatusClosed   ReportStatus = "Closed"
)

type AbuseReport struct {
	ID             uuid.UUID       `gorm:"type:uuid;default:gen_random_uuid();primaryKey" json:"id"`
	ReporterUserID uuid.UUID       `gorm:"type:uuid;not null;index" json:"reporter_user_id"`
	ReportedUserID uuid.UUID       `gorm:"type:uuid;not null;index" json:"reported_user_id"`
	Reason         string          `gorm:"type:text;not null" json:"reason"`
	Status         ReportStatus    `gorm:"type:varchar(20);default:'Open'" json:"status"`
	ActionTaken    *string         `gorm:"type:varchar(100)" json:"action_taken"`
	ResolvedAt     *time.Time      `json:"resolved_at"`
	CreatedAt      time.Time       `gorm:"autoCreateTime" json:"created_at"`
	Messages       []ReportMessage `gorm:"foreignKey:ReportID" json:"messages,omitempty"`
}

type ReportMessage struct {
	ID        uuid.UUID `gorm:"type:uuid;default:gen_random_uuid();primaryKey" json:"id"`
	ReportID  uuid.UUID `gorm:"type:uuid;not null;index" json:"report_id"`
	SenderID  uuid.UUID `gorm:"type:uuid;not null" json:"sender_id"`
	Message   string    `gorm:"type:text;not null" json:"message"`
	CreatedAt time.Time `gorm:"autoCreateTime" json:"created_at"`
}

func (r *AbuseReport) BeforeCreate(tx *gorm.DB) error {
	if r.ID == uuid.Nil {
		r.ID = uuid.New()
	}
	return nil
}

func (m *ReportMessage) BeforeCreate(tx *gorm.DB) error {
	if m.ID == uuid.Nil {
		m.ID = uuid.New()
	}
	return nil
}

