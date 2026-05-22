package response

import (
	"time"

	"github.com/google/uuid"
)

type Event struct {
	ID             uuid.UUID `json:"id"`
	EventName      string    `json:"event_name"`
	EventDate      time.Time `json:"event_date"`
	EventAddress   string    `json:"event_address"`
	OrganizerName  string    `json:"organizer_name"`
	OrganizerPhone string    `json:"organizer_phone"`
	Description    string    `json:"description"`
	Category       string    `json:"category"`
	RegistrationLink string  `json:"registration_link"`
	CtaText        string    `json:"cta_text"`
	Image          *string   `json:"image"`
	CreatedAt      time.Time `json:"created_at"`
	UpdatedAt      time.Time `json:"updated_at"`
}
