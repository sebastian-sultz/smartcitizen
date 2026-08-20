package volunteer

import (
	"context"
	"time"

	dtorequest "backend/dto/request"
	"backend/modules/user"
	"backend/pkg/utils"

	"gorm.io/gorm"
)

type Repository interface {
	Create(volunteer *Volunteer) error
	FindByID(id string) (*Volunteer, error)
	FindAll(filter dtorequest.VolunteerFilter, pagination *utils.Pagination) ([]Volunteer, error)
	Update(volunteer *Volunteer) error
	Delete(id string) error
	UpdateStatus(volunteerID string, status string, userID string, targetUserType string) error
	StreamVolunteers(ctx context.Context, filter dtorequest.VolunteerFilter, fn func(v Volunteer) error) error
	FindAllFiltered(ctx context.Context, filter dtorequest.VolunteerFilter) ([]Volunteer, error)
}

type repository struct {
	db *gorm.DB
}

func NewRepository(db *gorm.DB) Repository {
	return &repository{db: db}
}

func (r *repository) Create(volunteer *Volunteer) error {
	return r.db.Transaction(func(tx *gorm.DB) error {
		if err := tx.Create(volunteer).Error; err != nil {
			return err
		}
		if volunteer.Status == VolunteerStatusApproved {
			if err := tx.Model(&user.User{}).Where("id = ?", volunteer.UserID).Update("user_type", string(user.Volunteer)).Error; err != nil {
				return err
			}
		}
		return nil
	})
}

func (r *repository) FindByID(id string) (*Volunteer, error) {
	var volunteer Volunteer
	err := r.db.Where("id = ?", id).First(&volunteer).Error
	if err != nil {
		return nil, err
	}
	return &volunteer, nil
}

func applyVolunteerFilters(query *gorm.DB, filter dtorequest.VolunteerFilter) *gorm.DB {
	if filter.OnlyApproved != nil && *filter.OnlyApproved {
		query = query.Where("status = ? AND is_public_consent = ?", "APPROVED", true)
	}

	if filter.Status != nil && *filter.Status != "" && *filter.Status != "ALL" {
		query = query.Where("status = ?", *filter.Status)
	}

	if filter.Search != nil && *filter.Search != "" {
		searchTerm := "%" + *filter.Search + "%"
		query = query.Where(
			"name ILIKE ? OR email ILIKE ? OR phone ILIKE ? OR profession ILIKE ? OR specialties ILIKE ? OR experience ILIKE ? OR city ILIKE ? OR district ILIKE ? OR state ILIKE ? OR pincode ILIKE ? OR address ILIKE ?",
			searchTerm, searchTerm, searchTerm, searchTerm, searchTerm, searchTerm, searchTerm, searchTerm, searchTerm, searchTerm, searchTerm,
		)
	}

	if filter.Profession != nil && *filter.Profession != "" && *filter.Profession != "All" && *filter.Profession != "ALL" {
		query = query.Where("profession ILIKE ?", *filter.Profession)
	}

	if filter.State != nil && *filter.State != "" && *filter.State != "All" && *filter.State != "ALL" {
		query = query.Where("state ILIKE ?", *filter.State)
	}

	if filter.City != nil && *filter.City != "" && *filter.City != "All" && *filter.City != "ALL" {
		cityTerm := *filter.City
		query = query.Where("city ILIKE ? OR district ILIKE ?", cityTerm, cityTerm)
	}

	if filter.StartDate != nil && *filter.StartDate != "" {
		if st, err := time.Parse("2006-01-02", *filter.StartDate); err == nil {
			tStart := time.Date(st.Year(), st.Month(), st.Day(), 0, 0, 0, 0, st.Location())
			query = query.Where("created_at >= ?", tStart)
		} else if st, err := time.Parse(time.RFC3339, *filter.StartDate); err == nil {
			query = query.Where("created_at >= ?", st)
		}
	}

	if filter.EndDate != nil && *filter.EndDate != "" {
		if et, err := time.Parse("2006-01-02", *filter.EndDate); err == nil {
			tEnd := time.Date(et.Year(), et.Month(), et.Day(), 23, 59, 59, 999999999, et.Location())
			query = query.Where("created_at <= ?", tEnd)
		} else if et, err := time.Parse(time.RFC3339, *filter.EndDate); err == nil {
			query = query.Where("created_at <= ?", et)
		}
	}

	return query
}

func getVolunteerOrderClause(sort *string) string {
	if sort == nil {
		return "created_at desc"
	}
	switch *sort {
	case "name_asc":
		return "name asc"
	case "name_desc":
		return "name desc"
	case "city_asc":
		return "city asc"
	case "city_desc":
		return "city desc"
	case "profession":
		return "profession asc"
	case "oldest":
		return "created_at asc"
	case "newest":
		return "created_at desc"
	default:
		return "created_at desc"
	}
}

func (r *repository) FindAll(filter dtorequest.VolunteerFilter, pagination *utils.Pagination) ([]Volunteer, error) {
	var volunteers []Volunteer
	query := r.db.Model(&Volunteer{})
	query = applyVolunteerFilters(query, filter)

	if err := query.Count(&pagination.TotalRows).Error; err != nil {
		return nil, err
	}
	pagination.Calculate()

	orderClause := getVolunteerOrderClause(filter.Sort)

	err := query.Order(orderClause).Limit(pagination.Limit).Offset(pagination.Offset).Find(&volunteers).Error
	return volunteers, err
}

func (r *repository) Update(volunteer *Volunteer) error {
	return r.db.Save(volunteer).Error
}

func (r *repository) Delete(id string) error {
	return r.db.Where("id = ?", id).Delete(&Volunteer{}).Error
}

func (r *repository) UpdateStatus(volunteerID string, status string, userID string, targetUserType string) error {
	return r.db.Transaction(func(tx *gorm.DB) error {
		if err := tx.Model(&Volunteer{}).Where("id = ?", volunteerID).Update("status", status).Error; err != nil {
			return err
		}
		if err := tx.Model(&user.User{}).Where("id = ?", userID).Update("user_type", targetUserType).Error; err != nil {
			return err
		}
		return nil
	})
}

func (r *repository) StreamVolunteers(ctx context.Context, filter dtorequest.VolunteerFilter, fn func(v Volunteer) error) error {
	query := r.db.WithContext(ctx).Model(&Volunteer{})
	query = applyVolunteerFilters(query, filter)
	orderClause := getVolunteerOrderClause(filter.Sort)

	rows, err := query.Order(orderClause).Rows()
	if err != nil {
		return err
	}
	defer rows.Close()

	for rows.Next() {
		select {
		case <-ctx.Done():
			return ctx.Err()
		default:
		}

		var v Volunteer
		if err := r.db.ScanRows(rows, &v); err != nil {
			return err
		}
		if err := fn(v); err != nil {
			return err
		}
	}
	return rows.Err()
}

func (r *repository) FindAllFiltered(ctx context.Context, filter dtorequest.VolunteerFilter) ([]Volunteer, error) {
	var volunteers []Volunteer
	query := r.db.WithContext(ctx).Model(&Volunteer{})
	query = applyVolunteerFilters(query, filter)
	orderClause := getVolunteerOrderClause(filter.Sort)

	err := query.Order(orderClause).Find(&volunteers).Error
	return volunteers, err
}


