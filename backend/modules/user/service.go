package user

import (
	"context"
	"encoding/csv"
	"errors"
	"fmt"
	"io"
	"strconv"
	"strings"
	"time"

	"backend/dto/request"
	"backend/dto/response"
	"backend/pkg/cloudinary"
	"backend/pkg/utils"

	"github.com/johnfercher/maroto/v2/pkg/components/col"
	"github.com/johnfercher/maroto/v2/pkg/components/line"
	"github.com/johnfercher/maroto/v2/pkg/components/row"
	"github.com/johnfercher/maroto/v2/pkg/components/text"
	"github.com/johnfercher/maroto/v2/pkg/consts/align"
	"github.com/johnfercher/maroto/v2/pkg/consts/fontstyle"
	"github.com/johnfercher/maroto/v2/pkg/props"
	"golang.org/x/crypto/bcrypt"
)

type Service interface {
	GetUser(id string) (*User, error)
	Register(req *request.RegisterUser) (*User, error)
	Login(req *request.LoginUser) (*User, error)
	ForgetPassword(req *request.ForgetPassword) error
	UpdateProfilePhoto(ctx context.Context, id string, url string, publicID string) error
	GetSystemStats() (int64, int64, int64, float64, error)
	GetNonAdminUsers(filter request.UserFilter, pagination *utils.Pagination) ([]User, error)
	SuspendUser(id string, suspend bool) error
	DeleteUser(id string) error
	GetUsersByReferralID(referralID string) ([]User, error)
	GetVolunteerByUserID(userID string) (*response.Volunteer, error)
	RecordSuccessfulPayment(userID string, amount float64) error
	GetDownlineNetwork(ctx context.Context, userID string, recursive bool, pagination *utils.Pagination) (*response.UserNetworkResponse, error)
	GetNetworkStats(ctx context.Context, userID string) (*response.UserNetworkStatsResponse, error)
	GetUserByPhone(phone string) (*User, error)
	SetPassword(userID string, plainPassword string) error
	UpdateName(userID string, name string) error
	AddDirectMember(referrerUserID string, req *request.AddDirectMember) (*User, error)
	ExportUsersCSV(ctx context.Context, filter request.UserFilter, w io.Writer) error
	ExportUsersPDF(ctx context.Context, filter request.UserFilter) ([]byte, error)
	ExportUserNetworkCSV(ctx context.Context, userID string, recursive bool, w io.Writer) error
	ExportUserNetworkPDF(ctx context.Context, userID string, recursive bool) ([]byte, error)
	ExportUserDossierPDF(ctx context.Context, userID string) ([]byte, error)
}

type service struct {
	repo Repository
}

func NewService(repo Repository) Service {
	return &service{repo: repo}
}

func (s *service) GetUser(id string) (*User, error) {
	return s.repo.FindByID(id)
}

func (s *service) GetUserByPhone(phone string) (*User, error) {
	return s.repo.FindByPhone(phone)
}

func (s *service) Register(req *request.RegisterUser) (*User, error) {
	existingUser, _ := s.repo.FindByPhone(req.Phone)
	if existingUser != nil {
		return nil, errors.New("phone number already registered")
	}

	var passwordHash string
	if req.Password != "" {
		hashedPassword, err := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
		if err != nil {
			return nil, err
		}
		passwordHash = string(hashedPassword)
	} else {
		passwordHash = ""
	}

	user := &User{
		Name:         req.Name,
		Phone:        req.Phone,
		Password:     passwordHash,
		ProfilePhoto: req.ProfilePhoto,
		ReferralID:   req.ReferralID,
		UserType:     Member,
	}

	if err := s.repo.Create(user); err != nil {
		return nil, err
	}

	return user, nil
}

func (s *service) Login(req *request.LoginUser) (*User, error) {
	user, err := s.repo.FindByPhone(req.Phone)
	if err != nil {
		return nil, errors.New("invalid credentials")
	}

	if user.IsSuspended {
		return nil, errors.New("your account has been suspended")
	}

	err = bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(req.Password))
	if err != nil {
		return nil, errors.New("invalid credentials")
	}

	return user, nil
}

func (s *service) ForgetPassword(req *request.ForgetPassword) error {
	user, err := s.repo.FindByPhone(req.Phone)
	if err != nil {
		return errors.New("user not found")
	}

	if user.UserType == Admin {
		return errors.New("admin password reset cannot be performed via unauthenticated request")
	}

	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(req.NewPassword), bcrypt.DefaultCost)
	if err != nil {
		return err
	}

	user.Password = string(hashedPassword)

	return s.repo.Update(user)
}

func (s *service) SetPassword(userID string, plainPassword string) error {
	user, err := s.repo.FindByID(userID)
	if err != nil {
		return errors.New("user not found")
	}

	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(plainPassword), bcrypt.DefaultCost)
	if err != nil {
		return err
	}

	user.Password = string(hashedPassword)
	return s.repo.Update(user)
}

func (s *service) UpdateName(userID string, name string) error {
	user, err := s.repo.FindByID(userID)
	if err != nil {
		return err
	}
	user.Name = name
	return s.repo.Update(user)
}

func (s *service) UpdateProfilePhoto(ctx context.Context, id string, url string, publicID string) error {
	user, err := s.repo.FindByID(id)
	if err != nil {
		return errors.New("user not found")
	}

	if user.ProfilePhotoPublicID != nil && *user.ProfilePhotoPublicID != "" {
		_ = cloudinary.DeleteImage(ctx, *user.ProfilePhotoPublicID)
	}

	user.ProfilePhoto = &url
	user.ProfilePhotoPublicID = &publicID

	return s.repo.Update(user)
}

func (s *service) GetSystemStats() (int64, int64, int64, float64, error) {
	return s.repo.GetSystemStats()
}

func (s *service) GetNonAdminUsers(filter request.UserFilter, pagination *utils.Pagination) ([]User, error) {
	return s.repo.FindNonAdminUsers(filter, pagination)
}

func (s *service) SuspendUser(id string, suspend bool) error {
	user, err := s.repo.FindByID(id)
	if err != nil {
		return errors.New("user not found")
	}
	user.IsSuspended = suspend
	return s.repo.Update(user)
}

func (s *service) DeleteUser(id string) error {
	return s.repo.Delete(id)
}

func (s *service) GetUsersByReferralID(referralID string) ([]User, error) {
	return s.repo.FindByReferralID(referralID)
}

func (s *service) GetVolunteerByUserID(userID string) (*response.Volunteer, error) {
	return s.repo.FindVolunteerByUserID(userID)
}

func (s *service) RecordSuccessfulPayment(userID string, amount float64) error {
	return s.repo.RecordSuccessfulPayment(userID, amount)
}

func computeNetworkDonations(userID string, referralsMap map[string][]User, directDonations map[string]float64, cache map[string]float64) float64 {
	if val, exists := cache[userID]; exists {
		return val
	}
	sum := 0.0
	children := referralsMap[userID]
	for _, child := range children {
		childID := child.ID.String()
		sum += directDonations[childID]
		sum += computeNetworkDonations(childID, referralsMap, directDonations, cache)
	}
	cache[userID] = sum
	return sum
}

func computeDownlineCount(userID string, referralsMap map[string][]User, countCache map[string]int64) int64 {
	if val, exists := countCache[userID]; exists {
		return val
	}
	count := int64(0)
	children := referralsMap[userID]
	for _, child := range children {
		childID := child.ID.String()
		count += 1
		count += computeDownlineCount(childID, referralsMap, countCache)
	}
	countCache[userID] = count
	return count
}

func buildDownline(parentID string, currentLevel int, maxLevel int, referralsMap map[string][]User, usersByID map[string]User, directDonations map[string]float64, donationCache map[string]float64, countCache map[string]int64, results *[]response.ReferralInfo) {
	children := referralsMap[parentID]
	parentUser, hasParent := usersByID[parentID]
	sponsorName := "N/A"
	sponsorMemberID := "N/A"
	if hasParent {
		sponsorName = parentUser.Name
		sponsorMemberID = parentUser.MemberID
	}

	for _, child := range children {
		childID := child.ID.String()
		netDonations := computeNetworkDonations(childID, referralsMap, directDonations, donationCache)
		subTreeCount := computeDownlineCount(childID, referralsMap, countCache)

		statusStr := "Active"
		if child.IsSuspended {
			statusStr = "Suspended"
		}

		roleStr := string(child.UserType)
		if child.UserType == Volunteer {
			roleStr = "Volunteer"
		} else if child.UserType == Admin {
			roleStr = "Admin"
		} else {
			roleStr = "Citizen"
		}

		*results = append(*results, response.ReferralInfo{
			ID:                    child.ID,
			MemberID:              child.MemberID,
			Name:                  child.Name,
			Phone:                 child.Phone,
			Role:                  roleStr,
			Status:                statusStr,
			Level:                 currentLevel,
			SponsorName:           sponsorName,
			SponsorMemberID:       sponsorMemberID,
			DirectReferralsCount:  child.TotalReferrals,
			DirectReferralRevenue: child.ReferralPaymentAmount,
			DownlineTreeSize:      subTreeCount,
			TotalDirectDonations:  child.TotalAmount,
			TotalNetworkDonations: netDonations,
			JoinedAt:              child.CreatedAt,
		})

		if maxLevel == -1 || currentLevel < maxLevel {
			buildDownline(childID, currentLevel+1, maxLevel, referralsMap, usersByID, directDonations, donationCache, countCache, results)
		}
	}
}

func (s *service) GetDownlineNetwork(ctx context.Context, userID string, recursive bool, pagination *utils.Pagination) (*response.UserNetworkResponse, error) {
	users, err := s.repo.FindAllNonAdminUsers()
	if err != nil {
		return nil, err
	}

	referralsMap := make(map[string][]User)
	usersByID := make(map[string]User)
	directDonations := make(map[string]float64)
	for _, u := range users {
		uIDStr := u.ID.String()
		usersByID[uIDStr] = u
		if u.ReferralID != nil && *u.ReferralID != "" {
			referralsMap[*u.ReferralID] = append(referralsMap[*u.ReferralID], u)
		}
		directDonations[uIDStr] = u.TotalAmount
	}

	// Fetch root user if not in non-admin list
	if _, exists := usersByID[userID]; !exists {
		if rootU, err := s.repo.FindByID(userID); err == nil && rootU != nil {
			usersByID[userID] = *rootU
		}
	}

	donationCache := make(map[string]float64)
	countCache := make(map[string]int64)
	var referrals []response.ReferralInfo

	maxLevel := 1
	if recursive {
		maxLevel = -1
	}

	buildDownline(userID, 1, maxLevel, referralsMap, usersByID, directDonations, donationCache, countCache, &referrals)

	totalCount := int64(len(referrals))
	pagination.TotalRows = totalCount
	pagination.Calculate()

	var paginatedReferrals []response.ReferralInfo
	if pagination.Limit > 0 && totalCount > 0 {
		start := pagination.Offset
		end := pagination.Offset + pagination.Limit
		if start < int(totalCount) {
			if end > int(totalCount) {
				end = int(totalCount)
			}
			paginatedReferrals = referrals[start:end]
		}
	} else {
		paginatedReferrals = referrals
	}

	if paginatedReferrals == nil {
		paginatedReferrals = []response.ReferralInfo{}
	}

	return &response.UserNetworkResponse{
		UserID:     userID,
		Referrals:  paginatedReferrals,
		Pagination: pagination,
	}, nil
}

func (s *service) GetNetworkStats(ctx context.Context, userID string) (*response.UserNetworkStatsResponse, error) {
	// Fetch direct referrals using repository
	directReferrals, err := s.repo.FindByReferralID(userID)
	if err != nil {
		return nil, err
	}

	directCount := int64(len(directReferrals))
	directDonationsSum := 0.0
	for _, child := range directReferrals {
		directDonationsSum += child.TotalAmount
	}

	// Fetch overall downline count and network donations using high-performance recursive CTE
	totalDownlineCount, totalNetworkDonationAmount, err := s.repo.GetDownlineStats(userID)
	if err != nil {
		return nil, err
	}

	return &response.UserNetworkStatsResponse{
		DirectReferralsCount:         directCount,
		TotalDownlineCount:           totalDownlineCount,
		DirectReferralDonationAmount: directDonationsSum,
		TotalNetworkDonationAmount:   totalNetworkDonationAmount,
	}, nil
}

func (s *service) AddDirectMember(referrerUserID string, req *request.AddDirectMember) (*User, error) {
	referrer, err := s.repo.FindByID(referrerUserID)
	if err != nil {
		return nil, errors.New("referrer user not found")
	}

	existingUser, _ := s.repo.FindByPhone(req.Phone)
	if existingUser != nil {
		return nil, errors.New("phone number already registered")
	}

	refID := referrer.ID.String()
	user := &User{
		Name:       req.Name,
		Phone:      req.Phone,
		ReferralID: &refID,
		UserType:   Member,
	}

	if err := s.repo.Create(user); err != nil {
		return nil, err
	}

	return user, nil
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

func (s *service) ExportUsersCSV(ctx context.Context, filter request.UserFilter, w io.Writer) error {
	if _, err := w.Write([]byte("\xEF\xBB\xBF")); err != nil {
		return fmt.Errorf("failed to write UTF-8 BOM: %w", err)
	}

	csvWriter := csv.NewWriter(w)
	defer csvWriter.Flush()

	headers := []string{
		"Citizen ID",
		"System UUID",
		"Full Name",
		"Mobile Number",
		"User Role",
		"Direct Donations (INR)",
		"Total Payments Count",
		"Direct Referrals Count",
		"Referral Paid Count",
		"Referral Revenue (INR)",
		"Events Registered",
		"Referred By Code",
		"Account Status",
		"Registration Date",
		"Last Updated Date",
	}

	if err := csvWriter.Write(headers); err != nil {
		return fmt.Errorf("failed to write CSV headers: %w", err)
	}
	csvWriter.Flush()

	return s.repo.StreamNonAdminUsers(ctx, filter, func(u User) error {
		select {
		case <-ctx.Done():
			return ctx.Err()
		default:
		}

		sanitizedName := sanitizeCSVCell(u.Name)
		sanitizedPhone := sanitizeCSVCell(u.Phone)

		status := "Active"
		if u.IsSuspended {
			status = "Suspended"
		}

		referralID := "None"
		if u.ReferralID != nil && *u.ReferralID != "" {
			referralID = *u.ReferralID
		}

		row := []string{
			u.MemberID,
			u.ID.String(),
			sanitizedName,
			sanitizedPhone,
			string(u.UserType),
			fmt.Sprintf("%.2f", u.TotalAmount),
			strconv.FormatInt(u.TotalPayments, 10),
			strconv.FormatInt(u.TotalReferrals, 10),
			strconv.FormatInt(u.ReferralPaymentCount, 10),
			fmt.Sprintf("%.2f", u.ReferralPaymentAmount),
			strconv.FormatInt(u.TotalEventsRegistered, 10),
			referralID,
			status,
			u.CreatedAt.Format("02 Jan 2006 15:04:05"),
			u.UpdatedAt.Format("02 Jan 2006 15:04:05"),
		}

		if err := csvWriter.Write(row); err != nil {
			return err
		}
		csvWriter.Flush()
		return csvWriter.Error()
	})
}

func (s *service) ExportUsersPDF(ctx context.Context, filter request.UserFilter) ([]byte, error) {
	users, err := s.repo.FindAllNonAdminUsersFiltered(ctx, filter)
	if err != nil {
		return nil, fmt.Errorf("failed to fetch users for PDF: %w", err)
	}

	m := utils.BuildPortraitMaroto()

	utils.AddAdminReportHeader(m, utils.AdminReportHeaderProps{
		Title:       "SMART CITIZEN MEMBERS AUDIT REPORT",
		TotalCount:  len(users),
		GeneratedAt: time.Now(),
	})

	totalDonations := 0.0
	totalReferrals := int64(0)
	for _, u := range users {
		totalDonations += u.TotalAmount
		totalReferrals += u.TotalReferrals
	}

	cardBg := &props.Color{Red: 248, Green: 250, Blue: 252}
	darkBlue := &props.Color{Red: 15, Green: 23, Blue: 42}
	emerald := &props.Color{Red: 16, Green: 185, Blue: 129}
	muted := &props.Color{Red: 100, Green: 116, Blue: 139}

	// Summary Statistics Card Row
	m.AddRows(
		row.New(10).Add(
			col.New(4).WithStyle(&props.Cell{BackgroundColor: cardBg}).Add(
				text.New("TOTAL MEMBERS", props.Text{Size: 6.5, Style: fontstyle.Bold, Color: muted, Top: 1}),
				text.New(fmt.Sprintf("%d registered", len(users)), props.Text{Size: 9, Style: fontstyle.Bold, Color: darkBlue, Top: 4}),
			),
			col.New(4).WithStyle(&props.Cell{BackgroundColor: cardBg}).Add(
				text.New("TOTAL DONATIONS RAISED", props.Text{Size: 6.5, Style: fontstyle.Bold, Color: muted, Top: 1}),
				text.New(fmt.Sprintf("Rs. %.2f", totalDonations), props.Text{Size: 9, Style: fontstyle.Bold, Color: darkBlue, Top: 4}),
			),
			col.New(4).WithStyle(&props.Cell{BackgroundColor: cardBg}).Add(
				text.New("TOTAL DIRECT REFERRALS", props.Text{Size: 6.5, Style: fontstyle.Bold, Color: muted, Top: 1}),
				text.New(fmt.Sprintf("%d members", totalReferrals), props.Text{Size: 9, Style: fontstyle.Bold, Color: emerald, Top: 4}),
			),
		),
		row.New(3).Add(col.New(12)),
	)

	// Table Header
	headerBg := darkBlue
	headerFg := &props.Color{Red: 255, Green: 255, Blue: 255}

	m.AddRows(
		row.New(6.5).Add(
			col.New(1).WithStyle(&props.Cell{BackgroundColor: headerBg}).Add(
				text.New("S.No.", props.Text{Size: 7, Style: fontstyle.Bold, Color: headerFg, Top: 1.8}),
			),
			col.New(3).WithStyle(&props.Cell{BackgroundColor: headerBg}).Add(
				text.New("MEMBER / CITIZEN ID", props.Text{Size: 7, Style: fontstyle.Bold, Color: headerFg, Top: 1.8}),
			),
			col.New(2).WithStyle(&props.Cell{BackgroundColor: headerBg}).Add(
				text.New("PHONE / ROLE / STATUS", props.Text{Size: 7, Style: fontstyle.Bold, Color: headerFg, Top: 1.8}),
			),
			col.New(2).WithStyle(&props.Cell{BackgroundColor: headerBg}).Add(
				text.New("DONATIONS", props.Text{Size: 7, Style: fontstyle.Bold, Color: headerFg, Top: 1.8}),
			),
			col.New(2).WithStyle(&props.Cell{BackgroundColor: headerBg}).Add(
				text.New("REFERRALS", props.Text{Size: 7, Style: fontstyle.Bold, Color: headerFg, Top: 1.8}),
			),
			col.New(2).WithStyle(&props.Cell{BackgroundColor: headerBg}).Add(
				text.New("JOINED DATE", props.Text{Size: 7, Style: fontstyle.Bold, Color: headerFg, Top: 1.8, Align: align.Right}),
			),
		),
	)

	altBg := &props.Color{Red: 248, Green: 250, Blue: 252}
	whiteBg := &props.Color{Red: 255, Green: 255, Blue: 255}

	for i, u := range users {
		bg := whiteBg
		if i%2 == 1 {
			bg = altBg
		}

		status := "Active"
		if u.IsSuspended {
			status = "Suspended"
		}

		roleStr := string(u.UserType)
		if u.UserType == Volunteer {
			roleStr = "Volunteer"
		} else if u.UserType == Admin {
			roleStr = "Admin"
		} else {
			roleStr = "Citizen"
		}

		m.AddRows(
			row.New(6).Add(
				col.New(1).WithStyle(&props.Cell{BackgroundColor: bg}).Add(
					text.New(fmt.Sprintf("%d", i+1), props.Text{Size: 6.5, Color: darkBlue, Top: 1.5}),
				),
				col.New(3).WithStyle(&props.Cell{BackgroundColor: bg}).Add(
					text.New(u.Name, props.Text{Size: 6.5, Style: fontstyle.Bold, Color: darkBlue, Top: 1}),
					text.New(u.MemberID, props.Text{Size: 5.5, Color: muted, Top: 3.5}),
				),
				col.New(2).WithStyle(&props.Cell{BackgroundColor: bg}).Add(
					text.New(u.Phone, props.Text{Size: 6.5, Top: 1}),
					text.New(fmt.Sprintf("%s (%s)", roleStr, status), props.Text{Size: 5.5, Color: muted, Top: 3.5}),
				),
				col.New(2).WithStyle(&props.Cell{BackgroundColor: bg}).Add(
					text.New(fmt.Sprintf("Rs. %.2f", u.TotalAmount), props.Text{Size: 6.5, Style: fontstyle.Bold, Color: darkBlue, Top: 1}),
					text.New(fmt.Sprintf("%d payments", u.TotalPayments), props.Text{Size: 5.5, Color: muted, Top: 3.5}),
				),
				col.New(2).WithStyle(&props.Cell{BackgroundColor: bg}).Add(
					text.New(fmt.Sprintf("%d invites", u.TotalReferrals), props.Text{Size: 6.5, Top: 1}),
					text.New(fmt.Sprintf("%d paid", u.ReferralPaymentCount), props.Text{Size: 5.5, Color: muted, Top: 3.5}),
				),
				col.New(2).WithStyle(&props.Cell{BackgroundColor: bg}).Add(
					text.New(u.CreatedAt.Format("02/01/2006"), props.Text{Size: 6.5, Align: align.Right, Top: 1.5}),
				),
			),
		)
	}

	// Footer page line
	m.AddRows(
		row.New(6).Add(
			col.New(12).Add(
				line.New(props.Line{Color: &props.Color{Red: 203, Green: 213, Blue: 225}, Thickness: 0.5}),
				text.New("Global Smart Citizens Foundation - Confidential & Certified Member Records", props.Text{
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
		return nil, fmt.Errorf("failed to render users PDF: %w", err)
	}

	return document.GetBytes(), nil
}

func (s *service) ExportUserNetworkCSV(ctx context.Context, userID string, recursive bool, w io.Writer) error {
	rootUser, err := s.repo.FindByID(userID)
	if err != nil {
		return fmt.Errorf("root user not found: %w", err)
	}

	networkResp, err := s.GetDownlineNetwork(ctx, userID, recursive, &utils.Pagination{Limit: -1})
	if err != nil {
		return fmt.Errorf("failed to load network: %w", err)
	}

	if _, err := w.Write([]byte("\xEF\xBB\xBF")); err != nil {
		return fmt.Errorf("failed to write UTF-8 BOM: %w", err)
	}

	writer := csv.NewWriter(w)
	defer writer.Flush()

	headers := []string{
		"Level",
		"Referral Type",
		"Citizen ID",
		"Member Name",
		"Mobile Number",
		"Role",
		"Status",
		"Referred By (Name)",
		"Referred By (Citizen ID)",
		"Personal Donations (INR)",
		"Direct Members Referred",
		"Direct Referrals Donations (INR)",
		"Network Team Members Count",
		"Network Team Total Donations (INR)",
		"Total Combined Impact (INR)",
		"Joined Date",
		"Root Member Name",
		"Root Member ID",
	}
	if err := writer.Write(headers); err != nil {
		return err
	}

	for _, ref := range networkResp.Referrals {
		levelType := "Direct (Level 1)"
		if ref.Level > 1 {
			levelType = fmt.Sprintf("Indirect (Level %d)", ref.Level)
		}

		mID := ref.MemberID
		if mID == "" {
			mID = fmt.Sprintf("GSC-%s", strings.ToUpper(ref.ID.String()[:8]))
		}

		totalTeamImpact := ref.TotalDirectDonations + ref.TotalNetworkDonations

		sponsorName := ref.SponsorName
		if sponsorName == "" || sponsorName == "N/A" {
			sponsorName = "Direct / Top"
		}

		row := []string{
			strconv.Itoa(ref.Level),
			levelType,
			mID,
			sanitizeCSVCell(ref.Name),
			sanitizeCSVCell(ref.Phone),
			ref.Role,
			ref.Status,
			sanitizeCSVCell(sponsorName),
			ref.SponsorMemberID,
			fmt.Sprintf("%.2f", ref.TotalDirectDonations),
			strconv.FormatInt(ref.DirectReferralsCount, 10),
			fmt.Sprintf("%.2f", ref.DirectReferralRevenue),
			strconv.FormatInt(ref.DownlineTreeSize, 10),
			fmt.Sprintf("%.2f", ref.TotalNetworkDonations),
			fmt.Sprintf("%.2f", totalTeamImpact),
			ref.JoinedAt.Format("02 Jan 2006 15:04:05"),
			sanitizeCSVCell(rootUser.Name),
			rootUser.MemberID,
		}

		if err := writer.Write(row); err != nil {
			return err
		}
	}

	return nil
}

func (s *service) ExportUserNetworkPDF(ctx context.Context, userID string, recursive bool) ([]byte, error) {
	rootUser, err := s.repo.FindByID(userID)
	if err != nil {
		return nil, fmt.Errorf("root user not found: %w", err)
	}

	networkResp, err := s.GetDownlineNetwork(ctx, userID, recursive, &utils.Pagination{Limit: -1})
	if err != nil {
		return nil, fmt.Errorf("failed to load network: %w", err)
	}

	stats, _ := s.GetNetworkStats(ctx, userID)

	m := utils.BuildPortraitMaroto()

	modeTitle := "DIRECT REFERRALS REPORT (LEVEL 1)"
	if recursive {
		modeTitle = "MULTI-LEVEL REFERRAL NETWORK & TEAM AUDIT"
	}

	utils.AddAdminReportHeader(m, utils.AdminReportHeaderProps{
		Title:       fmt.Sprintf("%s - %s (%s)", modeTitle, rootUser.Name, rootUser.MemberID),
		TotalCount:  len(networkResp.Referrals),
		GeneratedAt: time.Now(),
	})

	cardBg := &props.Color{Red: 248, Green: 250, Blue: 252}
	darkBlue := &props.Color{Red: 15, Green: 23, Blue: 42}
	emerald := &props.Color{Red: 16, Green: 185, Blue: 129}
	muted := &props.Color{Red: 100, Green: 116, Blue: 139}

	// Summary Statistics Row
	m.AddRows(
		row.New(10).Add(
			col.New(3).WithStyle(&props.Cell{BackgroundColor: cardBg}).Add(
				text.New("DIRECT REFERRALS", props.Text{Size: 6, Style: fontstyle.Bold, Color: muted, Top: 1}),
				text.New(fmt.Sprintf("%d members", stats.DirectReferralsCount), props.Text{Size: 8.5, Style: fontstyle.Bold, Color: darkBlue, Top: 4}),
				text.New(fmt.Sprintf("Rs. %.2f direct", stats.DirectReferralDonationAmount), props.Text{Size: 5.5, Color: muted, Top: 7.5}),
			),
			col.New(3).WithStyle(&props.Cell{BackgroundColor: cardBg}).Add(
				text.New("TEAM MEMBERS", props.Text{Size: 6, Style: fontstyle.Bold, Color: muted, Top: 1}),
				text.New(fmt.Sprintf("%d members", stats.TotalDownlineCount), props.Text{Size: 8.5, Style: fontstyle.Bold, Color: darkBlue, Top: 4}),
				text.New(fmt.Sprintf("Rs. %.2f team", stats.TotalNetworkDonationAmount), props.Text{Size: 5.5, Color: muted, Top: 7.5}),
			),
			col.New(3).WithStyle(&props.Cell{BackgroundColor: cardBg}).Add(
				text.New("PERSONAL DONATED", props.Text{Size: 6, Style: fontstyle.Bold, Color: muted, Top: 1}),
				text.New(fmt.Sprintf("Rs. %.2f", rootUser.TotalAmount), props.Text{Size: 8.5, Style: fontstyle.Bold, Color: darkBlue, Top: 4}),
				text.New(fmt.Sprintf("%d payments", rootUser.TotalPayments), props.Text{Size: 5.5, Color: muted, Top: 7.5}),
			),
			col.New(3).WithStyle(&props.Cell{BackgroundColor: cardBg}).Add(
				text.New("COMBINED IMPACT", props.Text{Size: 6, Style: fontstyle.Bold, Color: emerald, Top: 1}),
				text.New(fmt.Sprintf("Rs. %.2f", rootUser.TotalAmount+stats.TotalNetworkDonationAmount), props.Text{Size: 8.5, Style: fontstyle.Bold, Color: emerald, Top: 4}),
				text.New(fmt.Sprintf("Joined: %s", rootUser.CreatedAt.Format("02/01/2006")), props.Text{Size: 5.5, Color: muted, Top: 7.5}),
			),
		),
		row.New(3).Add(col.New(12)),
	)

	// Table Header
	headerBg := darkBlue
	headerFg := &props.Color{Red: 255, Green: 255, Blue: 255}

	m.AddRows(
		row.New(6.5).Add(
			col.New(2).WithStyle(&props.Cell{BackgroundColor: headerBg}).Add(
				text.New("LEVEL / CITIZEN ID", props.Text{Size: 7, Style: fontstyle.Bold, Color: headerFg, Top: 1.8}),
			),
			col.New(3).WithStyle(&props.Cell{BackgroundColor: headerBg}).Add(
				text.New("MEMBER / REFERRED BY", props.Text{Size: 7, Style: fontstyle.Bold, Color: headerFg, Top: 1.8}),
			),
			col.New(2).WithStyle(&props.Cell{BackgroundColor: headerBg}).Add(
				text.New("DONATIONS (PV)", props.Text{Size: 7, Style: fontstyle.Bold, Color: headerFg, Top: 1.8}),
			),
			col.New(2).WithStyle(&props.Cell{BackgroundColor: headerBg}).Add(
				text.New("TEAM DONATIONS", props.Text{Size: 7, Style: fontstyle.Bold, Color: headerFg, Top: 1.8}),
			),
			col.New(3).WithStyle(&props.Cell{BackgroundColor: headerBg}).Add(
				text.New("TOTAL IMPACT / JOINED", props.Text{Size: 7, Style: fontstyle.Bold, Color: headerFg, Top: 1.8, Align: align.Right}),
			),
		),
	)

	altBg := &props.Color{Red: 248, Green: 250, Blue: 252}
	whiteBg := &props.Color{Red: 255, Green: 255, Blue: 255}

	for i, ref := range networkResp.Referrals {
		bg := whiteBg
		if i%2 == 1 {
			bg = altBg
		}

		levelLabel := fmt.Sprintf("Lvl %d (Direct)", ref.Level)
		if ref.Level > 1 {
			levelLabel = fmt.Sprintf("Lvl %d (Indirect)", ref.Level)
		}

		mID := ref.MemberID
		if mID == "" {
			mID = fmt.Sprintf("GSC-%s", strings.ToUpper(ref.ID.String()[:8]))
		}

		sponsorText := ref.SponsorName
		if sponsorText == "" || sponsorText == "N/A" {
			sponsorText = "Direct / Top"
		}

		totalImpact := ref.TotalDirectDonations + ref.TotalNetworkDonations

		m.AddRows(
			row.New(6).Add(
				col.New(2).WithStyle(&props.Cell{BackgroundColor: bg}).Add(
					text.New(levelLabel, props.Text{Size: 6.5, Style: fontstyle.Bold, Color: darkBlue, Top: 1}),
					text.New(mID, props.Text{Size: 5.5, Color: muted, Top: 3.5}),
				),
				col.New(3).WithStyle(&props.Cell{BackgroundColor: bg}).Add(
					text.New(ref.Name, props.Text{Size: 6.5, Style: fontstyle.Bold, Color: darkBlue, Top: 1}),
					text.New("Ref: "+sponsorText, props.Text{Size: 5.5, Color: muted, Top: 3.5}),
				),
				col.New(2).WithStyle(&props.Cell{BackgroundColor: bg}).Add(
					text.New(fmt.Sprintf("Rs. %.2f", ref.TotalDirectDonations), props.Text{Size: 6.5, Style: fontstyle.Bold, Color: darkBlue, Top: 1}),
					text.New(fmt.Sprintf("%d invites", ref.DirectReferralsCount), props.Text{Size: 5.5, Color: muted, Top: 3.5}),
				),
				col.New(2).WithStyle(&props.Cell{BackgroundColor: bg}).Add(
					text.New(fmt.Sprintf("Rs. %.2f", ref.TotalNetworkDonations), props.Text{Size: 6.5, Style: fontstyle.Bold, Color: darkBlue, Top: 1}),
					text.New(fmt.Sprintf("%d team", ref.DownlineTreeSize), props.Text{Size: 5.5, Color: muted, Top: 3.5}),
				),
				col.New(3).WithStyle(&props.Cell{BackgroundColor: bg}).Add(
					text.New(fmt.Sprintf("Rs. %.2f", totalImpact), props.Text{Size: 6.5, Style: fontstyle.Bold, Color: emerald, Align: align.Right, Top: 1}),
					text.New(ref.JoinedAt.Format("02/01/2006"), props.Text{Size: 5.5, Color: muted, Align: align.Right, Top: 3.5}),
				),
			),
		)
	}

	m.AddRows(
		row.New(6).Add(
			col.New(12).Add(
				line.New(props.Line{Color: &props.Color{Red: 203, Green: 213, Blue: 225}, Thickness: 0.5}),
				text.New("Global Smart Citizens Foundation - Confidential Network Lineage & Downline Ledger", props.Text{
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
		return nil, fmt.Errorf("failed to render network PDF: %w", err)
	}

	return document.GetBytes(), nil
}

func (s *service) ExportUserDossierPDF(ctx context.Context, userID string) ([]byte, error) {
	u, err := s.repo.FindByID(userID)
	if err != nil {
		return nil, fmt.Errorf("member not found: %w", err)
	}

	stats, _ := s.GetNetworkStats(ctx, userID)
	payments, err := s.repo.GetUserPayments(ctx, userID)
	if err != nil {
		payments = []UserPaymentRecord{}
	}

	sponsorName := "Direct / Top Level (No Inviter)"
	sponsorMemberID := "ROOT"
	if u.ReferralID != nil && *u.ReferralID != "" {
		if inviter, err := s.repo.FindByID(*u.ReferralID); err == nil && inviter != nil {
			sponsorName = inviter.Name
			sponsorMemberID = inviter.MemberID
		} else {
			sponsorName = *u.ReferralID
		}
	}

	m := utils.BuildPortraitMaroto()

	utils.AddDossierHeader(m, utils.DossierHeaderProps{
		DocumentType: "OFFICIAL MEMBER KYC DOSSIER & FINANCIAL STATEMENT",
		SubjectName:  u.Name,
		SubjectID:    u.MemberID,
		GeneratedAt:  time.Now(),
	})

	cardBg := &props.Color{Red: 248, Green: 250, Blue: 252}
	darkBlue := &props.Color{Red: 15, Green: 23, Blue: 42}
	emerald := &props.Color{Red: 16, Green: 185, Blue: 129}
	rose := &props.Color{Red: 225, Green: 29, Blue: 72}
	muted := &props.Color{Red: 100, Green: 116, Blue: 139}

	statusColor := emerald
	statusText := "ACTIVE"
	if u.IsSuspended {
		statusColor = rose
		statusText = "SUSPENDED"
	}

	// Section 1: Member Identity & Account Status
	m.AddRows(
		row.New(6).Add(
			col.New(12).Add(
				text.New("1. CITIZEN IDENTITY & MEMBERSHIP PROFILE", props.Text{
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
				text.New(u.Name, props.Text{Size: 8, Style: fontstyle.Bold, Color: darkBlue, Top: 4}),
			),
			col.New(3).WithStyle(&props.Cell{BackgroundColor: cardBg}).Add(
				text.New("Citizen Member ID", props.Text{Size: 6.5, Color: muted, Top: 1}),
				text.New(u.MemberID, props.Text{Size: 8, Style: fontstyle.Bold, Color: darkBlue, Top: 4}),
			),
			col.New(3).WithStyle(&props.Cell{BackgroundColor: cardBg}).Add(
				text.New("Mobile Number", props.Text{Size: 6.5, Color: muted, Top: 1}),
				text.New(u.Phone, props.Text{Size: 8, Style: fontstyle.Bold, Color: darkBlue, Top: 4}),
			),
			col.New(3).WithStyle(&props.Cell{BackgroundColor: cardBg}).Add(
				text.New("Role / Status", props.Text{Size: 6.5, Color: muted, Top: 1}),
				text.New(fmt.Sprintf("%s (%s)", string(u.UserType), statusText), props.Text{Size: 8, Style: fontstyle.Bold, Color: statusColor, Top: 4}),
			),
		),
		row.New(8).Add(
			col.New(6).WithStyle(&props.Cell{BackgroundColor: cardBg}).Add(
				text.New("Registration Date", props.Text{Size: 6.5, Color: muted, Top: 1}),
				text.New(u.CreatedAt.Format("02 January 2006, 15:04 IST"), props.Text{Size: 8, Color: darkBlue, Top: 4}),
			),
			col.New(6).WithStyle(&props.Cell{BackgroundColor: cardBg}).Add(
				text.New("Invited & Referred By", props.Text{Size: 6.5, Color: muted, Top: 1}),
				text.New(fmt.Sprintf("%s (%s)", sponsorName, sponsorMemberID), props.Text{Size: 8, Style: fontstyle.Bold, Color: darkBlue, Top: 4}),
			),
		),
		row.New(3).Add(col.New(12)),
	)

	// Section 2: 4 Financial & Referral KPI Stat Cards
	m.AddRows(
		row.New(6).Add(
			col.New(12).Add(
				text.New("2. CONTRIBUTIONS & REFERRAL IMPACT SUMMARY", props.Text{
					Style: fontstyle.Bold,
					Size:  8.5,
					Color: darkBlue,
					Top:   1,
				}),
			),
		),
		row.New(11).Add(
			col.New(3).WithStyle(&props.Cell{BackgroundColor: cardBg}).Add(
				text.New("PERSONAL DONATED", props.Text{Size: 6, Style: fontstyle.Bold, Color: muted, Top: 1}),
				text.New(fmt.Sprintf("Rs. %.2f", u.TotalAmount), props.Text{Size: 9.5, Style: fontstyle.Bold, Color: darkBlue, Top: 4}),
				text.New(fmt.Sprintf("%d successful payments", u.TotalPayments), props.Text{Size: 6, Color: muted, Top: 8}),
			),
			col.New(3).WithStyle(&props.Cell{BackgroundColor: cardBg}).Add(
				text.New("DIRECT REFERRALS", props.Text{Size: 6, Style: fontstyle.Bold, Color: muted, Top: 1}),
				text.New(fmt.Sprintf("%d members", stats.DirectReferralsCount), props.Text{Size: 9.5, Style: fontstyle.Bold, Color: darkBlue, Top: 4}),
				text.New(fmt.Sprintf("Rs. %.2f raised", stats.DirectReferralDonationAmount), props.Text{Size: 6, Color: muted, Top: 8}),
			),
			col.New(3).WithStyle(&props.Cell{BackgroundColor: cardBg}).Add(
				text.New("TEAM MEMBERS", props.Text{Size: 6, Style: fontstyle.Bold, Color: muted, Top: 1}),
				text.New(fmt.Sprintf("%d members", stats.TotalDownlineCount), props.Text{Size: 9.5, Style: fontstyle.Bold, Color: darkBlue, Top: 4}),
				text.New(fmt.Sprintf("Rs. %.2f team volume", stats.TotalNetworkDonationAmount), props.Text{Size: 6, Color: muted, Top: 8}),
			),
			col.New(3).WithStyle(&props.Cell{BackgroundColor: cardBg}).Add(
				text.New("COMBINED IMPACT", props.Text{Size: 6, Style: fontstyle.Bold, Color: emerald, Top: 1}),
				text.New(fmt.Sprintf("Rs. %.2f", u.TotalAmount+stats.TotalNetworkDonationAmount), props.Text{Size: 9.5, Style: fontstyle.Bold, Color: emerald, Top: 4}),
				text.New("Personal + Network", props.Text{Size: 6, Color: muted, Top: 8}),
			),
		),
		row.New(3).Add(col.New(12)),
	)

	// Section 3: Chronological Donation Ledger Table
	m.AddRows(
		row.New(6).Add(
			col.New(8).Add(
				text.New("3. CHRONOLOGICAL PAYMENT & DONATION LEDGER", props.Text{
					Style: fontstyle.Bold,
					Size:  8.5,
					Color: darkBlue,
					Top:   1,
				}),
			),
			col.New(4).Add(
				text.New(fmt.Sprintf("Total Transactions: %d", len(payments)), props.Text{
					Size:  7.5,
					Style: fontstyle.Bold,
					Align: align.Right,
					Color: muted,
					Top:   1,
				}),
			),
		),
	)

	headerBg := darkBlue
	headerFg := &props.Color{Red: 255, Green: 255, Blue: 255}

	m.AddRows(
		row.New(6.5).Add(
			col.New(2).WithStyle(&props.Cell{BackgroundColor: headerBg}).Add(
				text.New("DATE / TIME", props.Text{Size: 7, Style: fontstyle.Bold, Color: headerFg, Top: 1.8}),
			),
			col.New(2).WithStyle(&props.Cell{BackgroundColor: headerBg}).Add(
				text.New("AMOUNT (INR)", props.Text{Size: 7, Style: fontstyle.Bold, Color: headerFg, Top: 1.8}),
			),
			col.New(2).WithStyle(&props.Cell{BackgroundColor: headerBg}).Add(
				text.New("PAYMENT MODE", props.Text{Size: 7, Style: fontstyle.Bold, Color: headerFg, Top: 1.8}),
			),
			col.New(3).WithStyle(&props.Cell{BackgroundColor: headerBg}).Add(
				text.New("UTR / TRANSACTION ID", props.Text{Size: 7, Style: fontstyle.Bold, Color: headerFg, Top: 1.8}),
			),
			col.New(2).WithStyle(&props.Cell{BackgroundColor: headerBg}).Add(
				text.New("80G RECEIPT NUMBER", props.Text{Size: 7, Style: fontstyle.Bold, Color: headerFg, Top: 1.8}),
			),
			col.New(1).WithStyle(&props.Cell{BackgroundColor: headerBg}).Add(
				text.New("STATUS", props.Text{Size: 7, Style: fontstyle.Bold, Color: headerFg, Top: 1.8, Align: align.Right}),
			),
		),
	)

	altBg := &props.Color{Red: 248, Green: 250, Blue: 252}
	whiteBg := &props.Color{Red: 255, Green: 255, Blue: 255}

	if len(payments) == 0 {
		m.AddRows(
			row.New(8).Add(
				col.New(12).WithStyle(&props.Cell{BackgroundColor: whiteBg}).Add(
					text.New("No payment or donation records recorded for this member.", props.Text{Size: 7.5, Color: muted, Top: 2, Align: align.Center}),
				),
			),
		)
	} else {
		for i, p := range payments {
			bg := whiteBg
			if i%2 == 1 {
				bg = altBg
			}

			rNum := p.ReceiptNumber
			if rNum == "" {
				rNum = "Pending / N/A"
			}

			m.AddRows(
				row.New(6).Add(
					col.New(2).WithStyle(&props.Cell{BackgroundColor: bg}).Add(
						text.New(p.CreatedAt.Format("02/01/2006 15:04"), props.Text{Size: 6.5, Top: 1.5}),
					),
					col.New(2).WithStyle(&props.Cell{BackgroundColor: bg}).Add(
						text.New(fmt.Sprintf("Rs. %.2f", float64(p.Amount)/100.0), props.Text{Size: 6.5, Style: fontstyle.Bold, Color: darkBlue, Top: 1.5}),
					),
					col.New(2).WithStyle(&props.Cell{BackgroundColor: bg}).Add(
						text.New(p.PaymentMethod, props.Text{Size: 6.5, Top: 1.5}),
					),
					col.New(3).WithStyle(&props.Cell{BackgroundColor: bg}).Add(
						text.New(p.ProviderReferenceID, props.Text{Size: 6.5, Top: 1.5}),
					),
					col.New(2).WithStyle(&props.Cell{BackgroundColor: bg}).Add(
						text.New(rNum, props.Text{Size: 6.5, Top: 1.5}),
					),
					col.New(1).WithStyle(&props.Cell{BackgroundColor: bg}).Add(
						text.New(p.Status, props.Text{Size: 6.5, Style: fontstyle.Bold, Color: emerald, Align: align.Right, Top: 1.5}),
					),
				),
			)
		}
	}

	// Section 4: Official Verification & Security Disclaimer Footer
	m.AddRows(
		row.New(5).Add(col.New(12)),
		row.New(12).Add(
			col.New(8).Add(
				line.New(props.Line{Color: &props.Color{Red: 226, Green: 232, Blue: 240}, Thickness: 0.5}),
				text.New("STATUTORY COMPLIANCE & 80G TAX EXEMPTION NOTICE", props.Text{Size: 6, Style: fontstyle.Bold, Color: darkBlue, Top: 2}),
				text.New("This official document is generated from the certified database of Global Smart Citizens Foundation. All donations are exempt under Section 80G of the Income Tax Act. For verification, contact audit@smartcitizen.org.", props.Text{
					Size:  5.5,
					Color: muted,
					Top:   5,
				}),
			),
			col.New(4).Add(
				line.New(props.Line{Color: &props.Color{Red: 226, Green: 232, Blue: 240}, Thickness: 0.5}),
				text.New("AUTHORIZED SIGNATORY / SEAL", props.Text{Size: 6, Style: fontstyle.Bold, Color: darkBlue, Align: align.Right, Top: 2}),
				text.New("Verified Administrative Copy", props.Text{Size: 5.5, Style: fontstyle.Italic, Color: emerald, Align: align.Right, Top: 5}),
			),
		),
	)

	document, err := m.Generate()
	if err != nil {
		return nil, fmt.Errorf("failed to render user dossier PDF: %w", err)
	}

	return document.GetBytes(), nil
}


