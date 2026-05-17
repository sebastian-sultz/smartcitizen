package main

import (
	"log"
	"os"

	"backend/infrastructure/database"
	"backend/modules/user"

	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)

func main() {
	if err := godotenv.Load(); err != nil {
		log.Println("No .env file found, relying on environment variables")
	}

	dsn := os.Getenv("DATABASE_URL")
	if dsn == "" {
		dsn = "host=localhost user=postgres password=postgres dbname=smart_db port=5432 sslmode=disable"
	}
	db := database.Connect(dsn)

	// In Postgres, to use gen_random_uuid(), pgcrypto extension is often needed, but from PG 13 it is built-in.
	err := db.AutoMigrate(&user.User{})
	if err != nil {
		log.Fatalf("Failed to auto migrate: %v", err)
	}

	r := gin.Default()
	api := r.Group("/api")

	userRepo := user.NewRepository(db)
	userService := user.NewService(userRepo)
	userHandler := user.NewHandler(userService)

	userHandler.RegisterRoutes(api)

	port := os.Getenv("PORT")
	if port == "" {
		port = "8085" // Using 8085 as an uncommon open port
	}

	log.Printf("Starting server on port %s", port)
	r.Run(":" + port)
}
