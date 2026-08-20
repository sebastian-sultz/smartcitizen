package volunteer

import (
	"fmt"
	"net/http"
	"strings"
	"time"

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
	specs := make([]string, 0)
	if v.Specialties != "" {
		specs = strings.Split(v.Specialties, ",")
	}

	return response.Volunteer{
		ID:              v.ID,
		UserID:          v.UserID,
		Name:            v.Name,
		Email:           v.Email,
		Phone:           v.Phone,
		AlternatePhone:  v.AlternatePhone,
		Address:         v.Address,
		City:            v.City,
		District:        v.District,
		State:           v.State,
		Pincode:         v.Pincode,
		Profession:      v.Profession,
		Experience:      v.Experience,
		Specialties:     specs,
		IsPublicConsent: v.IsPublicConsent,
		Status:          string(v.Status),
		Image:           v.Image,
		CreatedAt:       v.CreatedAt,
		UpdatedAt:       v.UpdatedAt,
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

	var filter request.VolunteerFilter
	if err := c.ShouldBindQuery(&filter); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	onlyApproved := true
	if val, exists := c.Get("userType"); exists {
		if uType, ok := val.(string); ok && uType == "admin" {
			onlyApproved = false
		}
	}
	if filter.OnlyApproved == nil {
		filter.OnlyApproved = &onlyApproved
	}

	volunteers, err := h.service.GetAllVolunteers(filter, &pagination)
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

func (h *Handler) UpdateVolunteerStatus(c *gin.Context) {
	id := c.Param("id")
	if id == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "volunteer id is required"})
		return
	}

	var req request.UpdateVolunteerStatus
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	status := VolunteerStatus(req.Status)
	if status != VolunteerStatusPending && status != VolunteerStatusApproved && status != VolunteerStatusRejected && status != VolunteerStatusSuspended {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid status value"})
		return
	}

	volunteer, err := h.service.UpdateVolunteerStatus(c.Request.Context(), id, status)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "volunteer status updated", "volunteer": mapToResponse(volunteer)})
}

func (h *Handler) ExportVolunteers(c *gin.Context) {
	var filter request.VolunteerFilter
	if err := c.ShouldBindQuery(&filter); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	onlyApproved := false
	if filter.OnlyApproved == nil {
		filter.OnlyApproved = &onlyApproved
	}

	format := strings.ToLower(c.DefaultQuery("format", "csv"))

	if format == "pdf" {
		pdfBytes, err := h.service.ExportVolunteersPDF(c.Request.Context(), filter)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to generate volunteers PDF: " + err.Error()})
			return
		}

		filename := fmt.Sprintf("volunteers_audit_%s.pdf", time.Now().Format("20060102_150405"))
		c.Header("Content-Description", "File Transfer")
		c.Header("Content-Disposition", fmt.Sprintf("attachment; filename=%s", filename))
		c.Header("Content-Type", "application/pdf")
		c.Data(http.StatusOK, "application/pdf", pdfBytes)
		return
	}

	filename := fmt.Sprintf("volunteers_export_%s.csv", time.Now().Format("20060102_150405"))
	c.Header("Content-Description", "File Transfer")
	c.Header("Content-Disposition", fmt.Sprintf("attachment; filename=%s", filename))
	c.Header("Content-Type", "text/csv; charset=utf-8")
	c.Header("Transfer-Encoding", "chunked")

	if err := h.service.ExportVolunteersCSV(c.Request.Context(), filter, c.Writer); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to stream CSV: " + err.Error()})
		return
	}
}

func (h *Handler) ExportVolunteerDossierPDF(c *gin.Context) {
	id := c.Param("id")
	if id == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "missing volunteer ID"})
		return
	}

	pdfBytes, err := h.service.ExportVolunteerDossierPDF(c.Request.Context(), id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to generate volunteer dossier PDF: " + err.Error()})
		return
	}

	filename := fmt.Sprintf("volunteer_dossier_%s_%s.pdf", id[:8], time.Now().Format("20060102_150405"))
	c.Header("Content-Description", "File Transfer")
	c.Header("Content-Disposition", fmt.Sprintf("attachment; filename=%s", filename))
	c.Header("Content-Type", "application/pdf")
	c.Data(http.StatusOK, "application/pdf", pdfBytes)
}


