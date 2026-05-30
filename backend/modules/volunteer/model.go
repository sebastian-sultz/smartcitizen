package volunteer

import (
	"time"

	"backend/modules/user"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type Volunteer struct {
	ID             uuid.UUID      `gorm:"type:uuid;primaryKey" json:"id"`
	UserID         uuid.UUID      `gorm:"type:uuid;not null;uniqueIndex" json:"user_id"`
	User           user.User      `gorm:"foreignKey:UserID;constraint:OnUpdate:CASCADE,OnDelete:CASCADE;" json:"user"`
	Name           string         `gorm:"not null" json:"name"`
	Email          string         `gorm:"unique;not null" json:"email"`
	Phone          string         `gorm:"not null" json:"phone"`
	AlternatePhone string         `json:"alternate_phone"`
	Address        string         `json:"address"`
	City           string         `json:"city"`
	District       string         `json:"district"`
	Pincode        string         `json:"pincode"`
	State          string         `json:"state"`
	Profession     string         `json:"profession"`
	Experience     string         `json:"experience"`
	IsPublicConsent bool          `gorm:"default:false" json:"ispublicconsent"`
	Image          *string        `json:"image"`
	ImagePublicID  *string        `json:"-"`
	CreatedAt      time.Time      `json:"created_at"`
	UpdatedAt      time.Time      `json:"updated_at"`
	DeletedAt      gorm.DeletedAt `gorm:"index" json:"deleted_at,omitempty"`
}

func (v *Volunteer) BeforeCreate(tx *gorm.DB) error {
	if v.ID == uuid.Nil {
		v.ID = uuid.New()
	}
	return nil
}
