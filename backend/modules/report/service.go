package report

import (
	"errors"
	"time"

	"github.com/google/uuid"
)

type Service interface {
	CreateReport(userID uuid.UUID, title, description string) (*AbuseReport, error)
	GetReports(status string) ([]AbuseReport, error)
	GetReportsByReporterID(reporterID uuid.UUID, status string) ([]AbuseReport, error)
	ResolveReport(id, actionTaken string, adminID uuid.UUID) (*AbuseReport, error)
	AddMessage(reportID string, senderID uuid.UUID, message string, isAdmin bool) (*ReportMessage, error)
	GetMessages(reportID string, userID uuid.UUID, isAdmin bool) ([]ReportMessage, error)
	GetReportByID(id string, userID uuid.UUID, isAdmin bool) (*AbuseReport, error)
}

type service struct {
	repo Repository
}

func NewService(repo Repository) Service {
	return &service{repo: repo}
}

func (s *service) CreateReport(userID uuid.UUID, title, description string) (*AbuseReport, error) {
	report := &AbuseReport{
		UserID:      userID,
		Title:       title,
		Description: description,
		Status:      StatusOpen,
	}

	if err := s.repo.CreateReport(report); err != nil {
		return nil, err
	}
	return report, nil
}

func (s *service) GetReports(status string) ([]AbuseReport, error) {
	return s.repo.GetReports(status)
}

func (s *service) GetReportsByReporterID(reporterID uuid.UUID, status string) ([]AbuseReport, error) {
	return s.repo.GetReportsByReporterID(reporterID.String(), status)
}

func (s *service) GetReportByID(id string, userID uuid.UUID, isAdmin bool) (*AbuseReport, error) {
	report, err := s.repo.GetReportByID(id)
	if err != nil {
		return nil, errors.New("report not found")
	}
	if !isAdmin && report.UserID != userID {
		return nil, errors.New("forbidden: you do not have access to this report")
	}
	return report, nil
}

func (s *service) ResolveReport(id, actionTaken string, adminID uuid.UUID) (*AbuseReport, error) {
	report, err := s.repo.GetReportByID(id)
	if err != nil {
		return nil, errors.New("report not found")
	}

	if report.Status == StatusResolved {
		return nil, errors.New("report already resolved")
	}

	now := time.Now()
	report.Status = StatusResolved
	report.ActionTaken = &actionTaken
	report.ResolvedAt = &now
	report.AdminID = &adminID

	if err := s.repo.UpdateReport(report); err != nil {
		return nil, err
	}

	return report, nil
}

func (s *service) AddMessage(reportID string, senderID uuid.UUID, message string, isAdmin bool) (*ReportMessage, error) {
	report, err := s.repo.GetReportByID(reportID)
	if err != nil {
		return nil, errors.New("report not found")
	}

	if !isAdmin && report.UserID != senderID {
		return nil, errors.New("forbidden: you can only message on your own reports")
	}

	reportIDUUID, err := uuid.Parse(reportID)
	if err != nil {
		return nil, errors.New("invalid report ID format")
	}

	msg := &ReportMessage{
		ReportID: reportIDUUID,
		SenderID: senderID,
		Message:  message,
	}

	if err := s.repo.AddMessage(msg); err != nil {
		return nil, err
	}

	return msg, nil
}

func (s *service) GetMessages(reportID string, userID uuid.UUID, isAdmin bool) ([]ReportMessage, error) {
	report, err := s.repo.GetReportByID(reportID)
	if err != nil {
		return nil, errors.New("report not found")
	}

	if !isAdmin && report.UserID != userID {
		return nil, errors.New("forbidden: you do not have access to this report's messages")
	}

	return s.repo.GetMessagesByReportID(reportID)
}
