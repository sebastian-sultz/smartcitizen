package event

import (
	"time"

	"backend/modules/user"
	"github.com/google/uuid"
	"gorm.io/gorm"
)

type EventType string

const (
	InitiativeEventType EventType = "Initiative"
	EventEventType      EventType = "Event"
)

type Event struct {
	ID               uuid.UUID      `gorm:"type:uuid;primaryKey" json:"id"`
	EventType        EventType      `gorm:"type:varchar(50);default:'Event'" json:"event_type"`
	EventName        string         `gorm:"not null" json:"event_name"`
	EventDate        time.Time      `gorm:"not null" json:"event_date"`
	EventAddress     string         `gorm:"not null" json:"event_address"`
	OrganizerName    string         `gorm:"not null" json:"organizer_name"`
	OrganizerPhone   string         `gorm:"not null" json:"organizer_phone"`
	Description      string         `json:"description"`
	Category         string         `gorm:"type:varchar(100);default:'Community'" json:"category"`
	RegistrationLink string         `gorm:"type:text" json:"registration_link"`
	CtaText          string         `gorm:"type:varchar(100);default:'Register Now'" json:"cta_text"`
	Image            *string        `json:"image"`
	ImagePublicID    *string        `json:"-"`
	CreatedAt        time.Time      `json:"created_at"`
	UpdatedAt        time.Time      `json:"updated_at"`
	DeletedAt        gorm.DeletedAt `gorm:"index" json:"deleted_at,omitempty"`
}

func (e *Event) BeforeCreate(tx *gorm.DB) error {
	if e.ID == uuid.Nil {
		e.ID = uuid.New()
	}
	return nil
}

type EventRegistration struct {
	ID        uuid.UUID      `gorm:"type:uuid;primaryKey" json:"id"`
	EventID   uuid.UUID      `gorm:"type:uuid;not null;index;uniqueIndex:idx_user_event_reg" json:"event_id"`
	UserID    uuid.UUID      `gorm:"type:uuid;not null;index;uniqueIndex:idx_user_event_reg" json:"user_id"`
	Event     *Event         `gorm:"foreignKey:EventID;constraint:OnUpdate:CASCADE,OnDelete:CASCADE;" json:"event,omitempty"`
	User      *user.User     `gorm:"foreignKey:UserID;constraint:OnUpdate:CASCADE,OnDelete:CASCADE;" json:"user,omitempty"`
	CreatedAt time.Time      `json:"created_at"`
	UpdatedAt time.Time      `json:"updated_at"`
	DeletedAt gorm.DeletedAt `gorm:"index" json:"deleted_at,omitempty"`
}

func (e *EventRegistration) BeforeCreate(tx *gorm.DB) error {
	if e.ID == uuid.Nil {
		e.ID = uuid.New()
	}
	return nil
}
