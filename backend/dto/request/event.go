package request

import "time"

type CreateEvent struct {
	EventName      string    `json:"event_name" binding:"required"`
	EventDate      time.Time `json:"event_date" binding:"required"`
	EventAddress   string    `json:"event_address" binding:"required"`
	OrganizerName  string    `json:"organizer_name" binding:"required"`
	OrganizerPhone string    `json:"organizer_phone" binding:"required"`
	Description    string    `json:"description"`
}

// UpdateEvent represents fields that can be updated for an event.
type UpdateEvent struct {
	EventName      *string    `json:"event_name"`
	EventDate      *time.Time `json:"event_date"`
	EventAddress   *string    `json:"event_address"`
	OrganizerName  *string    `json:"organizer_name"`
	OrganizerPhone *string    `json:"organizer_phone"`
	Description    *string    `json:"description"`
}
