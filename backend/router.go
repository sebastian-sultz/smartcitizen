package main

import (
	"backend/infrastructure/middleware"
	"backend/modules/event"
	"backend/modules/report"
	"backend/modules/user"
	"backend/modules/volunteer"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func SetupRoutes(r *gin.Engine, db *gorm.DB) {
	r.Use(middleware.CORSMiddleware())
	api := r.Group("/api")

	// ==========================================
	// Dependencies Initialization
	// ==========================================
	userRepo := user.NewRepository(db)
	userService := user.NewService(userRepo)
	userHandler := user.NewHandler(userService)

	eventRepo := event.NewRepository(db)
	eventService := event.NewService(eventRepo)
	eventHandler := event.NewHandler(eventService)

	volunteerRepo := volunteer.NewRepository(db)
	volunteerService := volunteer.NewService(volunteerRepo, userService)
	volunteerHandler := volunteer.NewHandler(volunteerService)

	reportRepo := report.NewRepository(db)
	reportService := report.NewService(reportRepo)
	reportHandler := report.NewHandler(reportService)

	// ==========================================
	// ALL ROUTES REGISTRATION
	// ==========================================

	// User & Auth Routes
	auth := api.Group("/auth")
	{
		auth.POST("/register", userHandler.Register)
		auth.POST("/login", userHandler.Login)
		auth.POST("/forget-password", userHandler.ForgetPassword)
		auth.POST("/refresh", userHandler.Refresh)

		auth.GET("/stats", userHandler.GetStats)

		protected := auth.Group("")
		protected.Use(middleware.AuthMiddleware())
		protected.GET("/me", userHandler.Me)
		protected.PUT("/profile-photo/:id", userHandler.UpdateProfilePhoto)
		protected.GET("/profile/:id", userHandler.GetProfile)
	}

	// Users Routes
	users := api.Group("/users")
	users.Use(middleware.AuthMiddleware())
	{
		users.GET("/:id/events", eventHandler.GetEventsByUserID)
	}

	// Event Routes
	events := api.Group("/events")
	{
		events.GET("", eventHandler.GetAllEvents)
		events.GET("/:id", eventHandler.GetEvent)

		protected := events.Group("")
		protected.Use(middleware.AuthMiddleware())
		{
			protected.POST("", eventHandler.CreateEvent)
			protected.PUT("/:id", eventHandler.UpdateEvent)
			protected.DELETE("/:id", eventHandler.DeleteEvent)
			protected.POST("/:id/register", eventHandler.RegisterForEvent)
			protected.GET("/:id/users", eventHandler.GetUsersByEventID)
		}
	}

	// Volunteer Routes
	volunteers := api.Group("/volunteers")
	volunteers.Use(middleware.AuthMiddleware())
	{
		volunteers.POST("", volunteerHandler.CreateVolunteer)
		volunteers.GET("", volunteerHandler.GetAllVolunteers)
		volunteers.GET("/:id", volunteerHandler.GetVolunteer)
		volunteers.PUT("/:id", volunteerHandler.UpdateVolunteer)
		volunteers.PUT("/:id/image", volunteerHandler.UpdateVolunteerImage)
		volunteers.DELETE("/:id", volunteerHandler.DeleteVolunteer)
	}

	// Report Routes
	{
		// Authenticated routes
		protected := api.Group("")
		protected.Use(middleware.AuthMiddleware())
		
		// Create report (accessible to authenticated users)
		protected.POST("/reports", reportHandler.CreateReport)
		// Get specific report details
		protected.GET("/reports/:id", reportHandler.GetReport)
		// Messages sub-resource
		protected.POST("/reports/:id/messages", reportHandler.AddMessage)
		protected.GET("/reports/:id/messages", reportHandler.GetMessages)

		// Admin routes
		admin := api.Group("/admin")
		admin.Use(middleware.AuthMiddleware())
		admin.GET("/reports", reportHandler.GetReports)
		admin.PUT("/reports/:id/resolve", reportHandler.ResolveReport)
	}
}
