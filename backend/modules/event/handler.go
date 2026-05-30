package event

import (
	"fmt"
	"net/http"

	"backend/dto/request"
	"backend/dto/response"
	"backend/pkg/cloudinary"
	"backend/pkg/utils"

	"github.com/gin-gonic/gin"
)

type Handler struct {
	service Service
}

func NewHandler(service Service) *Handler {
	return &Handler{service: service}
}

func mapToResponse(e *Event) response.Event {
	return response.Event{
		ID:               e.ID,
		EventName:        e.EventName,
		EventType:        string(e.EventType),
		EventDate:        e.EventDate,
		EventAddress:     e.EventAddress,
		OrganizerName:    e.OrganizerName,
		OrganizerPhone:   e.OrganizerPhone,
		Description:      e.Description,
		Category:         e.Category,
		RegistrationLink: e.RegistrationLink,
		CtaText:          e.CtaText,
		Image:            e.Image,
		CreatedAt:        e.CreatedAt,
		UpdatedAt:        e.UpdatedAt,
	}
}

func (h *Handler) CreateEvent(c *gin.Context) {
	var req request.CreateEvent
	if err := c.ShouldBind(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	event, err := h.service.CreateEvent(&req)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	file, _, err := c.Request.FormFile("image")
	if err == nil {
		defer file.Close()
		url, publicID, err := cloudinary.UploadImage(c.Request.Context(), file, "smartcitizen/events")
		if err == nil {
			_ = h.service.UpdateEventImage(c.Request.Context(), event.ID.String(), url, publicID)
			event.Image = &url
		}
	}

	c.JSON(http.StatusCreated, gin.H{"message": "event created", "event": mapToResponse(event)})
}

func (h *Handler) GetAllEvents(c *gin.Context) {
	pagination := utils.GetPaginationFromContext(c)
	eventType := c.Query("event_type")

	events, err := h.service.GetAllEvents(eventType, &pagination)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	var res []response.Event
	for _, e := range events {
		res = append(res, mapToResponse(&e))
	}

	c.JSON(http.StatusOK, gin.H{
		"events":     res,
		"pagination": pagination,
	})
}

func (h *Handler) GetEvent(c *gin.Context) {
	id := c.Param("id")
	event, err := h.service.GetEvent(id)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "event not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"event": mapToResponse(event)})
}

func (h *Handler) UpdateEvent(c *gin.Context) {
	id := c.Param("id")
	var req request.UpdateEvent
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	event, err := h.service.UpdateEvent(id, &req)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "event updated", "event": mapToResponse(event)})
}


func (h *Handler) DeleteEvent(c *gin.Context) {
	id := c.Param("id")

	err := h.service.DeleteEvent(c.Request.Context(), id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "event deleted successfully"})
}

func (h *Handler) RegisterForEvent(c *gin.Context) {
	eventID := c.Param("id")
	userIDRaw, exists := c.Get("userID")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
		return
	}

	userTypeRaw, typeExists := c.Get("userType")
	if typeExists && fmt.Sprintf("%v", userTypeRaw) == "admin" {
		c.JSON(http.StatusForbidden, gin.H{"error": "admins cannot register for events"})
		return
	}

	userID := fmt.Sprintf("%v", userIDRaw)

	err := h.service.RegisterForEvent(eventID, userID)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"message": "successfully registered for event"})
}

func (h *Handler) GetUsersByEventID(c *gin.Context) {
	eventID := c.Param("id")
	regs, err := h.service.GetUsersByEventID(eventID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"registrations": regs})
}

func (h *Handler) GetEventsByUserID(c *gin.Context) {
	userID := c.Param("id")
	if userID == "me" {
		userIDRaw, exists := c.Get("userID")
		if !exists {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
			return
		}
		userID = fmt.Sprintf("%v", userIDRaw)
	}

	regs, err := h.service.GetEventsByUserID(userID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"registrations": regs})
}
