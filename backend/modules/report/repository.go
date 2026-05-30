package report

import (
	"gorm.io/gorm"
)

type Repository interface {
	CreateReport(report *AbuseReport) error
	GetReports(status string) ([]AbuseReport, error)
	GetReportsByReporterID(reporterID string, status string) ([]AbuseReport, error)
	GetReportByID(id string) (*AbuseReport, error)
	UpdateReport(report *AbuseReport) error
	AddMessage(message *ReportMessage) error
	GetMessagesByReportID(reportID string) ([]ReportMessage, error)
}

type repository struct {
	db *gorm.DB
}

func NewRepository(db *gorm.DB) Repository {
	return &repository{db: db}
}

func (r *repository) CreateReport(report *AbuseReport) error {
	return r.db.Create(report).Error
}

func (r *repository) GetReports(status string) ([]AbuseReport, error) {
	var reports []AbuseReport
	q := r.db.Model(&AbuseReport{})
	if status != "" {
		q = q.Where("status = ?", status)
	}
	err := q.Preload("User").Preload("Admin").Order("created_at desc").Find(&reports).Error
	return reports, err
}

func (r *repository) GetReportsByReporterID(reporterID string, status string) ([]AbuseReport, error) {
	var reports []AbuseReport
	q := r.db.Model(&AbuseReport{}).Preload("Messages").Where("reporter_user_id = ?", reporterID)
	if status != "" {
		q = q.Where("status = ?", status)
	}
	err := q.Order("created_at desc").Find(&reports).Error
	return reports, err
}

func (r *repository) GetReportByID(id string) (*AbuseReport, error) {
	var report AbuseReport
	err := r.db.Preload("Messages").Preload("User").Preload("Admin").First(&report, "id = ?", id).Error
	if err != nil {
		return nil, err
	}
	return &report, nil
}

func (r *repository) UpdateReport(report *AbuseReport) error {
	return r.db.Save(report).Error
}

func (r *repository) AddMessage(message *ReportMessage) error {
	return r.db.Create(message).Error
}

func (r *repository) GetMessagesByReportID(reportID string) ([]ReportMessage, error) {
	var messages []ReportMessage
	err := r.db.Where("report_id = ?", reportID).Order("created_at asc").Find(&messages).Error
	return messages, err
}
