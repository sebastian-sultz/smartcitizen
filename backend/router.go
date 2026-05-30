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

		protected := auth.Group("")
		protected.Use(middleware.AuthMiddleware())
		protected.GET("/me", userHandler.Me)
		protected.PUT("/profile-photo/:id", userHandler.UpdateProfilePhoto)
		protected.GET("/profile/:id", userHandler.GetProfile)
		protected.GET("/stats", userHandler.GetStats)
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
			protected.PUT("/:id/image", eventHandler.UpdateEventImage)
			protected.DELETE("/:id", eventHandler.DeleteEvent)
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
