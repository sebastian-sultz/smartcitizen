package event

import (
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
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	event, err := h.service.CreateEvent(&req)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
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

func (h *Handler) UpdateEventImage(c *gin.Context) {
	id := c.Param("id")
	if id == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "event id is required"})
		return
	}

	file, _, err := c.Request.FormFile("image")
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "image file is required"})
		return
	}
	defer file.Close()

	url, publicID, err := cloudinary.UploadImage(c.Request.Context(), file, "smartcitizen/events")
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to upload image"})
		return
	}

	err = h.service.UpdateEventImage(c.Request.Context(), id, url, publicID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "event image updated successfully",
		"url": url,
	})
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
