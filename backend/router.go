package main

import (
	"backend/infrastructure/middleware"
	"backend/modules/analytics"
	"backend/modules/event"
	"backend/modules/payment"
	"backend/modules/report"
	"backend/modules/user"
	"backend/modules/volunteer"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func SetupRoutes(r *gin.Engine, db *gorm.DB) {
	r.Use(middleware.GlobalLogger())
	r.Use(middleware.CORSMiddleware())

	// Health Check Route
	r.GET("/health", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"status":  "server is up and running",
			"service": "smartcitizen-backend",
		})
	})
	r.GET("", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"status":  "Chal rha hai",
			"service": "ChalaJaaa",
		})
	})

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

	paymentRepo := payment.NewRepository(db)
	paymentService := payment.NewService(paymentRepo, userService)
	paymentHandler := payment.NewHandler(paymentService)

	analyticsRepo := analytics.NewRepository(db)
	analyticsService := analytics.NewService(analyticsRepo)
	analyticsHandler := analytics.NewHandler(analyticsService)

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
		users.GET("", userHandler.GetAllNonAdminUsers)
		users.PUT("/:id/suspend", userHandler.SuspendUser)
		users.DELETE("/:id", userHandler.DeleteUser)
		users.GET("/:id/events", eventHandler.GetEventsByUserID)
		users.GET("/:id/referred", userHandler.GetReferredUsers)
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
			protected.GET("/:id/users", middleware.AdminMiddleware(), eventHandler.GetUsersByEventID)
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

		// Get user's own reports
		protected.GET("/reports", reportHandler.GetUserReports)
		// Create report (accessible to authenticated users)
		protected.POST("/reports", reportHandler.CreateReport)
		// Get specific report details
		protected.GET("/reports/:id", reportHandler.GetReport)
		// Messages sub-resource
		protected.POST("/reports/:id/messages", reportHandler.AddMessage)
		protected.GET("/reports/:id/messages", reportHandler.GetMessages)

		// Admin routes
		admin := api.Group("/admin")
		admin.Use(middleware.AuthMiddleware(), middleware.AdminMiddleware())
		admin.GET("/reports", reportHandler.GetReports)
		admin.PUT("/reports/:id/resolve", reportHandler.ResolveReport)

		// Donation Management admin routes
		admin.GET("/payments/export", paymentHandler.ExportCSV)
		admin.GET("/payments/export-10bd", paymentHandler.Export10BD)

		// Network Hierarchy admin routes
		admin.GET("/users/:id/network", userHandler.GetDownlineNetwork)
		admin.GET("/users/:id/network-stats", userHandler.GetNetworkStats)

		// Volunteer Lifecycle admin routes
		admin.PUT("/volunteers/:id/status", volunteerHandler.UpdateVolunteerStatus)

		// Analytics dashboard admin route
		admin.GET("/analytics", analyticsHandler.GetOperationalSummary)
		admin.POST("/payments/sync-receipts", paymentHandler.SyncPendingReceipts)
	}

	// Payment Routes
	payments := api.Group("/payments")
	{
		payments.POST("/initiate", middleware.OptionalAuthMiddleware(), paymentHandler.InitiatePayment)
		payments.POST("/webhook", paymentHandler.HandleWebhook)
		payments.GET("/status/:transactionId", middleware.OptionalAuthMiddleware(), paymentHandler.CheckPaymentStatus)
		payments.GET("/receipt/:transactionId", paymentHandler.GetReceipt)

		// Authenticated access for history and stats
		protected := payments.Group("")
		protected.Use(middleware.AuthMiddleware())
		protected.GET("/history", paymentHandler.GetPaymentHistory)
		protected.GET("/stats", paymentHandler.GetDonationStats)
		protected.GET("/certificates", paymentHandler.GetTaxCertificates)
		protected.PUT("/tax-details/:transactionId", paymentHandler.UpdateTaxDetails)
	}
}
