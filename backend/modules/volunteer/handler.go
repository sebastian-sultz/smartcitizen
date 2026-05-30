package volunteer

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

func mapToResponse(v *Volunteer) response.Volunteer {
	return response.Volunteer{
		ID:             v.ID,
		UserID:         v.UserID,
		Name:           v.Name,
		Email:          v.Email,
		Phone:          v.Phone,
		AlternatePhone: v.AlternatePhone,
		Address:        v.Address,
		City:           v.City,
		District:       v.District,
		Pincode:        v.Pincode,
		Profession:     v.Profession,
		Experience:     v.Experience,
		IsPublicConsent: v.IsPublicConsent,
		Image:          v.Image,
		CreatedAt:      v.CreatedAt,
		UpdatedAt:      v.UpdatedAt,
	}
}

func (h *Handler) CreateVolunteer(c *gin.Context) {
	var req request.CreateVolunteer
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	volunteer, err := h.service.CreateVolunteer(&req)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"message": "volunteer created", "volunteer": mapToResponse(volunteer)})
}

func (h *Handler) GetAllVolunteers(c *gin.Context) {
	pagination := utils.GetPaginationFromContext(c)
	search := c.Query("q") // search by name, profession, experience, location

	volunteers, err := h.service.GetAllVolunteers(search, &pagination)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	var res []response.Volunteer
	for _, v := range volunteers {
		res = append(res, mapToResponse(&v))
	}

	c.JSON(http.StatusOK, gin.H{
		"volunteers": res,
		"pagination": pagination,
	})
}

func (h *Handler) GetVolunteer(c *gin.Context) {
	id := c.Param("id")
	volunteer, err := h.service.GetVolunteer(id)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "volunteer not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"volunteer": mapToResponse(volunteer)})
}

func (h *Handler) UpdateVolunteer(c *gin.Context) {
	id := c.Param("id")
	var req request.UpdateVolunteer
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	volunteer, err := h.service.UpdateVolunteer(id, &req)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "volunteer updated", "volunteer": mapToResponse(volunteer)})
}

func (h *Handler) UpdateVolunteerImage(c *gin.Context) {
	id := c.Param("id")
	if id == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "volunteer id is required"})
		return
	}

	file, _, err := c.Request.FormFile("profilephoto")
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "profilephoto file is required"})
		return
	}
	defer file.Close()

	url, publicID, err := cloudinary.UploadImage(c.Request.Context(), file, "smartcitizen/volunteers")
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to upload image"})
		return
	}

	err = h.service.UpdateVolunteerImage(c.Request.Context(), id, url, publicID)
	if err != nil {
		// If DB update fails, we should ideally delete the newly uploaded image from Cloudinary to prevent orphans,
		// but since the old image deletion logic is in the service, this is a reasonable compromise.
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "volunteer profile photo updated successfully",
		"url":     url,
	})
}

func (h *Handler) DeleteVolunteer(c *gin.Context) {
	id := c.Param("id")

	err := h.service.DeleteVolunteer(c.Request.Context(), id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "volunteer deleted successfully"})
}
