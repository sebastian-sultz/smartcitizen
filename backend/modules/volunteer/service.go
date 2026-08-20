package volunteer

import (
	"context"
	"encoding/csv"
	"errors"
	"fmt"
	"io"
	"strings"
	"time"

	"backend/dto/request"
	"backend/modules/user"
	"backend/pkg/cloudinary"
	"backend/pkg/utils"

	"github.com/google/uuid"
	"github.com/johnfercher/maroto/v2/pkg/components/col"
	"github.com/johnfercher/maroto/v2/pkg/components/line"
	"github.com/johnfercher/maroto/v2/pkg/components/row"
	"github.com/johnfercher/maroto/v2/pkg/components/text"
	"github.com/johnfercher/maroto/v2/pkg/consts/align"
	"github.com/johnfercher/maroto/v2/pkg/consts/fontstyle"
	"github.com/johnfercher/maroto/v2/pkg/props"
)

type Service interface {
	CreateVolunteer(req *request.CreateVolunteer) (*Volunteer, error)
	GetVolunteer(id string) (*Volunteer, error)
	GetAllVolunteers(filter request.VolunteerFilter, pagination *utils.Pagination) ([]Volunteer, error)
	UpdateVolunteer(id string, req *request.UpdateVolunteer) (*Volunteer, error)
	UpdateVolunteerImage(ctx context.Context, id string, url string, publicID string) error
	DeleteVolunteer(ctx context.Context, id string) error
	UpdateVolunteerStatus(ctx context.Context, id string, status VolunteerStatus) (*Volunteer, error)
	ExportVolunteersCSV(ctx context.Context, filter request.VolunteerFilter, w io.Writer) error
	ExportVolunteersPDF(ctx context.Context, filter request.VolunteerFilter) ([]byte, error)
	ExportVolunteerDossierPDF(ctx context.Context, id string) ([]byte, error)
}

type service struct {
	repo        Repository
	userService user.Service
}

func NewService(repo Repository, userService user.Service) Service {
	return &service{repo: repo, userService: userService}
}

func (s *service) CreateVolunteer(req *request.CreateVolunteer) (*Volunteer, error) {
	u, err := s.userService.GetUser(req.UserID)
	if err != nil {
		return nil, errors.New("user not found")
	}

	if u.TotalReferrals < 10 {
		return nil, errors.New("not eligible yet: total referrals must be at least 10")
	}

	if u.ReferralPaymentCount < 10 {
		return nil, errors.New("not eligible yet: at least 10 referred payments are required")
	}

	// Secure user profile immediately with the provided password
	if err := s.userService.SetPassword(req.UserID, req.Password); err != nil {
		return nil, err
	}

	userID, err := uuid.Parse(req.UserID)
	if err != nil {
		return nil, errors.New("invalid user id format")
	}

	specialtiesStr := ""
	if len(req.Specialties) > 0 {
		specialtiesStr = strings.Join(req.Specialties, ",")
	}

	volunteer := &Volunteer{
		UserID:          userID,
		Name:            req.Name,
		Email:           req.Email,
		Phone:           req.Phone,
		AlternatePhone:  req.AlternatePhone,
		Address:         req.Address,
		City:            req.City,
		District:        req.District,
		State:           req.State,
		Pincode:         req.Pincode,
		Profession:      req.Profession,
		Experience:      req.Experience,
		Specialties:     specialtiesStr,
		IsPublicConsent: req.IsPublicConsent,
		Status:          VolunteerStatusApproved,
	}

	if u.ProfilePhoto != nil {
		volunteer.Image = u.ProfilePhoto
	}
	if u.ProfilePhotoPublicID != nil {
		volunteer.ImagePublicID = u.ProfilePhotoPublicID
	}

	if err := s.repo.Create(volunteer); err != nil {
		return nil, err
	}

	return volunteer, nil
}

func (s *service) GetVolunteer(id string) (*Volunteer, error) {
	return s.repo.FindByID(id)
}

func (s *service) GetAllVolunteers(filter request.VolunteerFilter, pagination *utils.Pagination) ([]Volunteer, error) {
	return s.repo.FindAll(filter, pagination)
}

func (s *service) UpdateVolunteer(id string, req *request.UpdateVolunteer) (*Volunteer, error) {
	volunteer, err := s.repo.FindByID(id)
	if err != nil {
		return nil, errors.New("volunteer not found")
	}

	if req.Name != nil {
		volunteer.Name = *req.Name
		if err := s.userService.UpdateName(volunteer.UserID.String(), *req.Name); err != nil {
			return nil, err
		}
	}
	if req.Email != nil {
		volunteer.Email = *req.Email
	}
	if req.Phone != nil {
		volunteer.Phone = *req.Phone
	}
	if req.AlternatePhone != nil {
		volunteer.AlternatePhone = *req.AlternatePhone
	}
	if req.Address != nil {
		volunteer.Address = *req.Address
	}
	if req.City != nil {
		volunteer.City = *req.City
	}
	if req.District != nil {
		volunteer.District = *req.District
	}
	if req.Pincode != nil {
		volunteer.Pincode = *req.Pincode
	}
	if req.Profession != nil {
		volunteer.Profession = *req.Profession
	}
	if req.Experience != nil {
		volunteer.Experience = *req.Experience
	}
	if req.IsPublicConsent != nil {
		volunteer.IsPublicConsent = *req.IsPublicConsent
	}

	if err := s.repo.Update(volunteer); err != nil {
		return nil, err
	}

	return volunteer, nil
}

func (s *service) UpdateVolunteerImage(ctx context.Context, id string, url string, publicID string) error {
	volunteer, err := s.repo.FindByID(id)
	if err != nil {
		return errors.New("volunteer not found")
	}

	return s.userService.UpdateProfilePhoto(ctx, volunteer.UserID.String(), url, publicID)
}

func (s *service) DeleteVolunteer(ctx context.Context, id string) error {
	volunteer, err := s.repo.FindByID(id)
	if err != nil {
		return errors.New("volunteer not found")
	}

	// Delete from Cloudinary if image exists
	if volunteer.ImagePublicID != nil && *volunteer.ImagePublicID != "" {
		_ = cloudinary.DeleteImage(ctx, *volunteer.ImagePublicID)
	}

	return s.repo.Delete(id)
}

func (s *service) UpdateVolunteerStatus(ctx context.Context, id string, status VolunteerStatus) (*Volunteer, error) {
	volunteer, err := s.repo.FindByID(id)
	if err != nil {
		return nil, errors.New("volunteer not found")
	}

	var targetUserType string
	if status == VolunteerStatusApproved {
		targetUserType = string(user.Volunteer)
	} else {
		targetUserType = string(user.Member)
	}

	if err := s.repo.UpdateStatus(id, string(status), volunteer.UserID.String(), targetUserType); err != nil {
		return nil, err
	}

	volunteer.Status = status
	return volunteer, nil
}

func sanitizeCSVCell(val string) string {
	if len(val) == 0 {
		return val
	}
	firstChar := val[0]
	if firstChar == '=' || firstChar == '+' || firstChar == '-' || firstChar == '@' || firstChar == '\t' || firstChar == '\r' {
		return "'" + val
	}
	return val
}

func (s *service) ExportVolunteersCSV(ctx context.Context, filter request.VolunteerFilter, w io.Writer) error {
	if _, err := w.Write([]byte("\xEF\xBB\xBF")); err != nil {
		return fmt.Errorf("failed to write UTF-8 BOM: %w", err)
	}

	csvWriter := csv.NewWriter(w)
	defer csvWriter.Flush()

	headers := []string{
		"Application ID",
		"User UUID",
		"Applicant Name",
		"Email Address",
		"Primary Phone",
		"Alternate Phone",
		"Full Address",
		"City",
		"District",
		"State",
		"Pincode",
		"Profession",
		"Prior Experience",
		"Specialties / Skills",
		"Public Directory Consent",
		"Application Status",
		"Applied Date",
		"Last Updated Date",
	}

	if err := csvWriter.Write(headers); err != nil {
		return fmt.Errorf("failed to write CSV headers: %w", err)
	}
	csvWriter.Flush()

	return s.repo.StreamVolunteers(ctx, filter, func(v Volunteer) error {
		select {
		case <-ctx.Done():
			return ctx.Err()
		default:
		}

		sanitizedName := sanitizeCSVCell(v.Name)
		sanitizedEmail := sanitizeCSVCell(v.Email)
		sanitizedPhone := sanitizeCSVCell(v.Phone)
		sanitizedAltPhone := sanitizeCSVCell(v.AlternatePhone)
		sanitizedAddress := sanitizeCSVCell(v.Address)
		sanitizedExperience := sanitizeCSVCell(v.Experience)

		consentStr := "No"
		if v.IsPublicConsent {
			consentStr = "Yes"
		}

		row := []string{
			v.ID.String(),
			v.UserID.String(),
			sanitizedName,
			sanitizedEmail,
			sanitizedPhone,
			sanitizedAltPhone,
			sanitizedAddress,
			v.City,
			v.District,
			v.State,
			v.Pincode,
			v.Profession,
			sanitizedExperience,
			v.Specialties,
			consentStr,
			string(v.Status),
			v.CreatedAt.Format("02 Jan 2006 15:04:05"),
			v.UpdatedAt.Format("02 Jan 2006 15:04:05"),
		}

		if err := csvWriter.Write(row); err != nil {
			return err
		}
		csvWriter.Flush()
		return csvWriter.Error()
	})
}

func (s *service) ExportVolunteersPDF(ctx context.Context, filter request.VolunteerFilter) ([]byte, error) {
	volunteers, err := s.repo.FindAllFiltered(ctx, filter)
	if err != nil {
		return nil, fmt.Errorf("failed to fetch volunteers for PDF: %w", err)
	}

	m := utils.BuildPortraitMaroto()

	utils.AddAdminReportHeader(m, utils.AdminReportHeaderProps{
		Title:       "VOLUNTEER APPLICATIONS & ROSTER AUDIT REPORT",
		TotalCount:  len(volunteers),
		GeneratedAt: time.Now(),
	})

	approvedCount := 0
	pendingCount := 0
	for _, v := range volunteers {
		if v.Status == "APPROVED" {
			approvedCount++
		} else if v.Status == "PENDING" {
			pendingCount++
		}
	}

	cardBg := &props.Color{Red: 248, Green: 250, Blue: 252}
	darkBlue := &props.Color{Red: 15, Green: 23, Blue: 42}
	emerald := &props.Color{Red: 16, Green: 185, Blue: 129}
	muted := &props.Color{Red: 100, Green: 116, Blue: 139}

	// Summary Statistics Row
	m.AddRows(
		row.New(10).Add(
			col.New(4).WithStyle(&props.Cell{BackgroundColor: cardBg}).Add(
				text.New("TOTAL APPLICANTS", props.Text{Size: 6.5, Style: fontstyle.Bold, Color: muted, Top: 1}),
				text.New(fmt.Sprintf("%d registered", len(volunteers)), props.Text{Size: 9, Style: fontstyle.Bold, Color: darkBlue, Top: 4}),
			),
			col.New(4).WithStyle(&props.Cell{BackgroundColor: cardBg}).Add(
				text.New("APPROVED VOLUNTEERS", props.Text{Size: 6.5, Style: fontstyle.Bold, Color: muted, Top: 1}),
				text.New(fmt.Sprintf("%d active", approvedCount), props.Text{Size: 9, Style: fontstyle.Bold, Color: emerald, Top: 4}),
			),
			col.New(4).WithStyle(&props.Cell{BackgroundColor: cardBg}).Add(
				text.New("PENDING REVIEW", props.Text{Size: 6.5, Style: fontstyle.Bold, Color: muted, Top: 1}),
				text.New(fmt.Sprintf("%d awaiting", pendingCount), props.Text{Size: 9, Style: fontstyle.Bold, Color: darkBlue, Top: 4}),
			),
		),
		row.New(3).Add(col.New(12)),
	)

	// Table Header
	headerBg := darkBlue
	headerFg := &props.Color{Red: 255, Green: 255, Blue: 255}

	m.AddRows(
		row.New(6.5).Add(
			col.New(4).WithStyle(&props.Cell{BackgroundColor: headerBg}).Add(
				text.New("APPLICANT / STATUS", props.Text{Size: 7, Style: fontstyle.Bold, Color: headerFg, Top: 1.8}),
			),
			col.New(3).WithStyle(&props.Cell{BackgroundColor: headerBg}).Add(
				text.New("PROFESSION & SKILLS", props.Text{Size: 7, Style: fontstyle.Bold, Color: headerFg, Top: 1.8}),
			),
			col.New(3).WithStyle(&props.Cell{BackgroundColor: headerBg}).Add(
				text.New("CONTACT (PHONE / EMAIL)", props.Text{Size: 7, Style: fontstyle.Bold, Color: headerFg, Top: 1.8}),
			),
			col.New(2).WithStyle(&props.Cell{BackgroundColor: headerBg}).Add(
				text.New("LOCATION / STATE", props.Text{Size: 7, Style: fontstyle.Bold, Color: headerFg, Top: 1.8, Align: align.Right}),
			),
		),
	)

	altBg := &props.Color{Red: 248, Green: 250, Blue: 252}
	whiteBg := &props.Color{Red: 255, Green: 255, Blue: 255}

	for i, v := range volunteers {
		bg := whiteBg
		if i%2 == 1 {
			bg = altBg
		}

		statusColor := emerald
		if v.Status == "REJECTED" {
			statusColor = &props.Color{Red: 225, Green: 29, Blue: 72}
		} else if v.Status == "PENDING" {
			statusColor = &props.Color{Red: 234, Green: 179, Blue: 8}
		}

		locStr := v.City
		if v.State != "" {
			locStr += " (" + v.State + ")"
		}

		m.AddRows(
			row.New(6).Add(
				col.New(4).WithStyle(&props.Cell{BackgroundColor: bg}).Add(
					text.New(v.Name, props.Text{Size: 6.5, Style: fontstyle.Bold, Color: darkBlue, Top: 1}),
					text.New(string(v.Status), props.Text{Size: 5.5, Style: fontstyle.Bold, Color: statusColor, Top: 3.5}),
				),
				col.New(3).WithStyle(&props.Cell{BackgroundColor: bg}).Add(
					text.New(v.Profession, props.Text{Size: 6.5, Style: fontstyle.Bold, Color: darkBlue, Top: 1}),
					text.New(v.Specialties, props.Text{Size: 5.5, Color: muted, Top: 3.5}),
				),
				col.New(3).WithStyle(&props.Cell{BackgroundColor: bg}).Add(
					text.New(v.Phone, props.Text{Size: 6.5, Top: 1}),
					text.New(v.Email, props.Text{Size: 5.5, Color: muted, Top: 3.5}),
				),
				col.New(2).WithStyle(&props.Cell{BackgroundColor: bg}).Add(
					text.New(locStr, props.Text{Size: 6.5, Align: align.Right, Top: 1}),
					text.New(v.CreatedAt.Format("02/01/2006"), props.Text{Size: 5.5, Color: muted, Align: align.Right, Top: 3.5}),
				),
			),
		)
	}

	// Footer line
	m.AddRows(
		row.New(6).Add(
			col.New(12).Add(
				line.New(props.Line{Color: &props.Color{Red: 203, Green: 213, Blue: 225}, Thickness: 0.5}),
				text.New("Global Smart Citizens Foundation - Confidential Volunteer Records Audit Document", props.Text{
					Size:  5.5,
					Color: muted,
					Top:   2,
					Align: align.Center,
				}),
			),
		),
	)

	document, err := m.Generate()
	if err != nil {
		return nil, fmt.Errorf("failed to render volunteers PDF: %w", err)
	}

	return document.GetBytes(), nil
}

func (s *service) ExportVolunteerDossierPDF(ctx context.Context, id string) ([]byte, error) {
	v, err := s.repo.FindByID(id)
	if err != nil {
		return nil, fmt.Errorf("volunteer application not found: %w", err)
	}

	m := utils.BuildPortraitMaroto()

	utils.AddDossierHeader(m, utils.DossierHeaderProps{
		DocumentType: "VOLUNTEER APPLICATION DOSSIER & PROFILE ACCREDITATION",
		SubjectName:  v.Name,
		SubjectID:    fmt.Sprintf("VOL-%s", strings.ToUpper(v.ID.String()[:8])),
		GeneratedAt:  time.Now(),
	})

	cardBg := &props.Color{Red: 248, Green: 250, Blue: 252}
	darkBlue := &props.Color{Red: 15, Green: 23, Blue: 42}
	emerald := &props.Color{Red: 16, Green: 185, Blue: 129}
	rose := &props.Color{Red: 225, Green: 29, Blue: 72}
	muted := &props.Color{Red: 100, Green: 116, Blue: 139}

	statusColor := emerald
	if v.Status == "REJECTED" {
		statusColor = rose
	} else if v.Status == "PENDING" {
		statusColor = &props.Color{Red: 234, Green: 179, Blue: 8}
	}

	consentText := "GRANTED (Authorized for Public Directory)"
	if !v.IsPublicConsent {
		consentText = "NOT GRANTED (Internal Confidential Only)"
	}

	altPhone := "None"
	if v.AlternatePhone != "" {
		altPhone = v.AlternatePhone
	}

	// Section 1: Applicant Identity & Contact Details
	m.AddRows(
		row.New(6).Add(
			col.New(12).Add(
				text.New("1. APPLICANT IDENTITY & CONTACT INFORMATION", props.Text{
					Style: fontstyle.Bold,
					Size:  8.5,
					Color: darkBlue,
					Top:   1,
				}),
			),
		),
		row.New(8).Add(
			col.New(3).WithStyle(&props.Cell{BackgroundColor: cardBg}).Add(
				text.New("Full Name", props.Text{Size: 6.5, Color: muted, Top: 1}),
				text.New(v.Name, props.Text{Size: 8, Style: fontstyle.Bold, Color: darkBlue, Top: 4}),
			),
			col.New(3).WithStyle(&props.Cell{BackgroundColor: cardBg}).Add(
				text.New("Application ID", props.Text{Size: 6.5, Color: muted, Top: 1}),
				text.New(fmt.Sprintf("VOL-%s", strings.ToUpper(v.ID.String()[:8])), props.Text{Size: 8, Style: fontstyle.Bold, Color: darkBlue, Top: 4}),
			),
			col.New(3).WithStyle(&props.Cell{BackgroundColor: cardBg}).Add(
				text.New("Primary Mobile", props.Text{Size: 6.5, Color: muted, Top: 1}),
				text.New(v.Phone, props.Text{Size: 8, Style: fontstyle.Bold, Color: darkBlue, Top: 4}),
			),
			col.New(3).WithStyle(&props.Cell{BackgroundColor: cardBg}).Add(
				text.New("Application Status", props.Text{Size: 6.5, Color: muted, Top: 1}),
				text.New(string(v.Status), props.Text{Size: 8, Style: fontstyle.Bold, Color: statusColor, Top: 4}),
			),
		),
		row.New(8).Add(
			col.New(4).WithStyle(&props.Cell{BackgroundColor: cardBg}).Add(
				text.New("Email Address", props.Text{Size: 6.5, Color: muted, Top: 1}),
				text.New(v.Email, props.Text{Size: 8, Color: darkBlue, Top: 4}),
			),
			col.New(4).WithStyle(&props.Cell{BackgroundColor: cardBg}).Add(
				text.New("Alternate Phone", props.Text{Size: 6.5, Color: muted, Top: 1}),
				text.New(altPhone, props.Text{Size: 8, Color: darkBlue, Top: 4}),
			),
			col.New(4).WithStyle(&props.Cell{BackgroundColor: cardBg}).Add(
				text.New("Applied Date", props.Text{Size: 6.5, Color: muted, Top: 1}),
				text.New(v.CreatedAt.Format("02 Jan 2006, 15:04 IST"), props.Text{Size: 8, Color: darkBlue, Top: 4}),
			),
		),
		row.New(3).Add(col.New(12)),
	)

	// Section 2: Residential Jurisdiction & Address
	m.AddRows(
		row.New(6).Add(
			col.New(12).Add(
				text.New("2. RESIDENTIAL JURISDICTION & LOCATION", props.Text{
					Style: fontstyle.Bold,
					Size:  8.5,
					Color: darkBlue,
					Top:   1,
				}),
			),
		),
		row.New(8).Add(
			col.New(3).WithStyle(&props.Cell{BackgroundColor: cardBg}).Add(
				text.New("City / Town", props.Text{Size: 6.5, Color: muted, Top: 1}),
				text.New(v.City, props.Text{Size: 8, Style: fontstyle.Bold, Color: darkBlue, Top: 4}),
			),
			col.New(3).WithStyle(&props.Cell{BackgroundColor: cardBg}).Add(
				text.New("District", props.Text{Size: 6.5, Color: muted, Top: 1}),
				text.New(v.District, props.Text{Size: 8, Style: fontstyle.Bold, Color: darkBlue, Top: 4}),
			),
			col.New(3).WithStyle(&props.Cell{BackgroundColor: cardBg}).Add(
				text.New("State / UT", props.Text{Size: 6.5, Color: muted, Top: 1}),
				text.New(v.State, props.Text{Size: 8, Style: fontstyle.Bold, Color: darkBlue, Top: 4}),
			),
			col.New(3).WithStyle(&props.Cell{BackgroundColor: cardBg}).Add(
				text.New("Postal PIN Code", props.Text{Size: 6.5, Color: muted, Top: 1}),
				text.New(v.Pincode, props.Text{Size: 8, Style: fontstyle.Bold, Color: darkBlue, Top: 4}),
			),
		),
		row.New(8).Add(
			col.New(12).WithStyle(&props.Cell{BackgroundColor: cardBg}).Add(
				text.New("Full Residential Address", props.Text{Size: 6.5, Color: muted, Top: 1}),
				text.New(v.Address, props.Text{Size: 8, Color: darkBlue, Top: 4}),
			),
		),
		row.New(3).Add(col.New(12)),
	)

	// Section 3: Professional Qualifications & Skills
	m.AddRows(
		row.New(6).Add(
			col.New(12).Add(
				text.New("3. PROFESSIONAL QUALIFICATIONS & SPECIALTIES", props.Text{
					Style: fontstyle.Bold,
					Size:  8.5,
					Color: darkBlue,
					Top:   1,
				}),
			),
		),
		row.New(8).Add(
			col.New(4).WithStyle(&props.Cell{BackgroundColor: cardBg}).Add(
				text.New("Profession / Occupation", props.Text{Size: 6.5, Color: muted, Top: 1}),
				text.New(v.Profession, props.Text{Size: 8, Style: fontstyle.Bold, Color: darkBlue, Top: 4}),
			),
			col.New(4).WithStyle(&props.Cell{BackgroundColor: cardBg}).Add(
				text.New("Key Specialties & Skills", props.Text{Size: 6.5, Color: muted, Top: 1}),
				text.New(v.Specialties, props.Text{Size: 8, Style: fontstyle.Bold, Color: darkBlue, Top: 4}),
			),
			col.New(4).WithStyle(&props.Cell{BackgroundColor: cardBg}).Add(
				text.New("Public Directory Consent", props.Text{Size: 6.5, Color: muted, Top: 1}),
				text.New(consentText, props.Text{Size: 7, Style: fontstyle.Bold, Color: darkBlue, Top: 4}),
			),
		),
		row.New(3).Add(col.New(12)),
	)

	// Section 4: Experience Statement
	expText := v.Experience
	if expText == "" {
		expText = "No prior volunteer experience statement submitted with this application."
	}

	m.AddRows(
		row.New(6).Add(
			col.New(12).Add(
				text.New("4. SOCIAL WORK EXPERIENCE & STATEMENT OF PURPOSE", props.Text{
					Style: fontstyle.Bold,
					Size:  8.5,
					Color: darkBlue,
					Top:   1,
				}),
			),
		),
		row.New(24).Add(
			col.New(12).WithStyle(&props.Cell{BackgroundColor: cardBg}).Add(
				text.New(expText, props.Text{
					Size:  7.5,
					Color: darkBlue,
					Top:   2,
				}),
			),
		),
		row.New(4).Add(col.New(12)),
	)

	// Section 5: Official Verification & Sign-off Footer
	m.AddRows(
		row.New(12).Add(
			col.New(8).Add(
				line.New(props.Line{Color: &props.Color{Red: 226, Green: 232, Blue: 240}, Thickness: 0.5}),
				text.New("ACCREDITATION & STATUTORY NOTICE", props.Text{Size: 6, Style: fontstyle.Bold, Color: darkBlue, Top: 2}),
				text.New("This official volunteer dossier is generated from the certified records of Global Smart Citizens Foundation. Information is confidential and accredited for authorized NGO social initiatives.", props.Text{
					Size:  5.5,
					Color: muted,
					Top:   5,
				}),
			),
			col.New(4).Add(
				line.New(props.Line{Color: &props.Color{Red: 226, Green: 232, Blue: 240}, Thickness: 0.5}),
				text.New("AUTHORIZED COORDINATOR / SEAL", props.Text{Size: 6, Style: fontstyle.Bold, Color: darkBlue, Align: align.Right, Top: 2}),
				text.New("Verified Administrative Copy", props.Text{Size: 5.5, Style: fontstyle.Italic, Color: emerald, Align: align.Right, Top: 5}),
			),
		),
	)

	document, err := m.Generate()
	if err != nil {
		return nil, fmt.Errorf("failed to render volunteer dossier PDF: %w", err)
	}

	return document.GetBytes(), nil
}


