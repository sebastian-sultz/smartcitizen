package main

import (
	"log"
	"os"
	"time"

	"backend/infrastructure/database"
	"backend/modules/event"
	"backend/modules/report"
	"backend/modules/user"
	"backend/modules/volunteer"
	"backend/pkg/cloudinary"

	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
	"golang.org/x/crypto/bcrypt"
)

func main() {
	if err := godotenv.Load(); err != nil {
		log.Println("No .env file found, relying on environment variables")
	}

	if err := cloudinary.InitCloudinary(); err != nil {
		log.Fatalf("Failed to initialize cloudinary: %v", err)
	}

	dsn := os.Getenv("DATABASE_URL")
	if dsn == "" {
		dsn = "host=localhost user=postgres password=postgres dbname=smart_db port=5432 sslmode=disable"
	}
	db := database.Connect(dsn)

	// In Postgres, to use gen_random_uuid(), pgcrypto extension is often needed, but from PG 13 it is built-in.
	err := db.AutoMigrate(&user.User{}, &event.Event{}, &event.EventRegistration{}, &volunteer.Volunteer{}, &report.AbuseReport{}, &report.ReportMessage{})
	if err != nil {
		log.Fatalf("Failed to auto migrate: %v", err)
	}

	// Seed events if database is empty
	var count int64
	db.Model(&event.Event{}).Count(&count)
	if count == 0 {
		log.Println("Seeding initial events into database...")
		seedEvents := []event.Event{
			{
				EventName:        "Awareness & Guidance Program",
				EventDate:        time.Date(2026, 7, 5, 10, 0, 0, 0, time.UTC),
				EventAddress:     "Community Hall, Sector 12, Dwarka, New Delhi",
				OrganizerName:    "GlobalSmart Core Team",
				OrganizerPhone:   "+919876543210",
				Description:      "A special program to provide legal and social guidance to community members, empowering them with knowledge of fundamental rights.",
				Category:         "Community",
				RegistrationLink: "https://globalsmartcitizensfoundation.org/register/guidance",
				CtaText:          "Register Now",
				Image:            stringPtr("/assets/a2.png"),
			},
			{
				EventName:        "Eco-Friendly Cleanliness Drive",
				EventDate:        time.Date(2026, 7, 12, 7, 30, 0, 0, time.UTC),
				EventAddress:     "Yamuna Riverfront, Delhi",
				OrganizerName:    "Green Warriors Group",
				OrganizerPhone:   "+919876543211",
				Description:      "Join our weekly cleanliness and tree plantation drive to promote eco-friendly practices, waste segregation, and local environmental health.",
				Category:         "Environment",
				RegistrationLink: "https://globalsmartcitizensfoundation.org/register/eco-drive",
				CtaText:          "Join as Volunteer",
				Image:            stringPtr("/assets/a1.png"),
			},
			{
				EventName:        "Grassroots Cricket Tournament",
				EventDate:        time.Date(2026, 7, 30, 9, 0, 0, 0, time.UTC),
				EventAddress:     "GlobalSmart Sports Complex, Rohini, Delhi",
				OrganizerName:    "Sports Development Cell",
				OrganizerPhone:   "+919876543212",
				Description:      "Inspiring youth participation through community sports. Watch local teams compete and develop skills in our annual grassroots cricket league.",
				Category:         "Sports",
				RegistrationLink: "https://globalsmartcitizensfoundation.org/register/cricket",
				CtaText:          "Register Team",
				Image:            stringPtr("/assets/a23.jpeg"),
			},
		}

		for _, e := range seedEvents {
			if err := db.Create(&e).Error; err != nil {
				log.Printf("Failed to seed event %s: %v", e.EventName, err)
			}
		}
		log.Println("Seeding complete.")
	}

	// Seed admin user if none exists in the database
	var adminCount int64
	db.Model(&user.User{}).Where("user_type = ?", user.Admin).Count(&adminCount)
	if adminCount == 0 {
		log.Println("Seeding initial admin user...")
		hashedPassword, err := bcrypt.GenerateFromPassword([]byte("admin123"), bcrypt.DefaultCost)
		if err != nil {
			log.Fatalf("Failed to hash admin password: %v", err)
		}
		admin := user.User{
			Name:     "System Admin",
			Phone:    "9999999999",
			Password: string(hashedPassword),
			UserType: user.Admin,
		}
		if err := db.Create(&admin).Error; err != nil {
			log.Printf("Failed to seed admin user: %v", err)
		} else {
			log.Println("Seeding admin user complete (Phone: 9999999999, Password: admin123).")
		}
	}


	r := gin.Default()
	SetupRoutes(r, db)
	port := os.Getenv("PORT")
	if port == "" {
		port = "8090" // Using 8090 as an uncommon open port
	}

	log.Printf("Starting server on port %s", port)
	r.Run(":" + port)
}

func stringPtr(s string) *string {
	return &s
}
