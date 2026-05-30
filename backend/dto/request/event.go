package request

import "time"

type CreateEvent struct {
	EventName        string    `form:"event_name" binding:"required"`
	EventType        string    `form:"event_type" binding:"omitempty,oneof=Initiative Event"`
	EventDate        time.Time `form:"event_date" binding:"required" time_format:"2006-01-02T15:04:05Z07:00"`
	EventAddress     string    `form:"event_address" binding:"required"`
	OrganizerName    string    `form:"organizer_name" binding:"required"`
	OrganizerPhone   string    `form:"organizer_phone" binding:"required"`
	Description      string    `form:"description"`
	Category         string    `form:"category"`
	RegistrationLink string    `form:"registration_link"`
	CtaText          string    `form:"cta_text"`
}

// UpdateEvent represents fields that can be updated for an event.
type UpdateEvent struct {
	EventName        *string    `json:"event_name"`
	EventType        *string    `json:"event_type" binding:"omitempty,oneof=Initiative Event"`
	EventDate        *time.Time `json:"event_date"`
	EventAddress     *string    `json:"event_address"`
	OrganizerName    *string    `json:"organizer_name"`
	OrganizerPhone   *string    `json:"organizer_phone"`
	Description      *string    `json:"description"`
	Category         *string    `json:"category"`
	RegistrationLink *string    `json:"registration_link"`
	CtaText          *string    `json:"cta_text"`
}
