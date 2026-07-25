package main

import (
	"log"
	"os"

	"backend/infrastructure/database"
	"backend/modules/event"
	"backend/modules/payment"
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

	appEnv := os.Getenv("APP_ENV")
	ginMode := os.Getenv("GIN_MODE")
	if ginMode == "release" || appEnv == "production" {
		gin.SetMode(gin.ReleaseMode)
	}

	secret := os.Getenv("JWT_SECRET")
	if secret == "" || secret == "supersecret" || len(secret) < 32 {
		log.Fatalf("FATAL: JWT_SECRET environment variable must be set to a secure string (min 32 characters)")
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
	err := db.AutoMigrate(&user.User{}, &event.Event{}, &event.EventRegistration{}, &volunteer.Volunteer{}, &report.AbuseReport{}, &report.ReportMessage{}, &payment.Payment{}, &payment.Receipt{}, &payment.ReceiptSequence{})
	if err != nil {
		log.Fatalf("Failed to auto migrate: %v", err)
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
		port = "8080"
	}

	log.Printf("Starting server on port %s", port)
	r.Run(":" + port)
}
