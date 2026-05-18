package event

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type Event struct {
	ID             uuid.UUID      `gorm:"type:uuid;primaryKey" json:"id"`
	EventName      string         `gorm:"not null" json:"event_name"`
	EventDate      time.Time      `gorm:"not null" json:"event_date"`
	EventAddress   string         `gorm:"not null" json:"event_address"`
	OrganizerName  string         `gorm:"not null" json:"organizer_name"`
	OrganizerPhone string         `gorm:"not null" json:"organizer_phone"`
	Description    string         `json:"description"`
	Image          *string        `json:"image"`
	ImagePublicID  *string        `json:"-"`
	CreatedAt      time.Time      `json:"created_at"`
	UpdatedAt      time.Time      `json:"updated_at"`
	DeletedAt      gorm.DeletedAt `gorm:"index" json:"deleted_at,omitempty"`
}

func (e *Event) BeforeCreate(tx *gorm.DB) error {
	if e.ID == uuid.Nil {
		e.ID = uuid.New()
	}
	return nil
}
