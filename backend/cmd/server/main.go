package main

import (
    "log"
    "time"
    "vedicpath/internal/infrastructure/config"
    "vedicpath/internal/infrastructure/database"
    "vedicpath/internal/infrastructure/cache"
    "github.com/gin-gonic/gin"
    "github.com/gin-contrib/cors"
    "vedicpath/internal/generator"
    "vedicpath/internal/auth"
    "vedicpath/internal/lessons"
    "vedicpath/internal/practice"
    "vedicpath/internal/extra"
)

func main() {
    cfg := config.Load()
    // MongoDB connection setup
    db := database.Connect(cfg.MongoDBURI)
    if err := database.RunMigrations(db, "vedicpath"); err != nil {
        log.Fatalf("Failed to run migrations: %v", err)
    }
    rdb := cache.Connect(cfg.RedisURL)

    r := gin.Default()

    // Generator setup
    seenStore, err := generator.NewMongoSeenStore(db.Database("vedicpath"), 30*24*time.Hour)
    if err != nil {
        log.Fatalf("Failed to initialize seen store: %v", err)
    }
    answerCache := generator.NewInMemoryAnswerCache()
    genService := generator.NewService(seenStore, answerCache)
    _ = generator.NewHandler(genService, db.Database("vedicpath"))

    // Configure CORS
    r.Use(cors.New(cors.Config{
        AllowOrigins:     []string{"http://localhost:5173"}, // Frontend origin
        AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
        AllowHeaders:     []string{"Origin", "Content-Type", "Authorization"},
        ExposeHeaders:    []string{"Content-Length"},
        AllowCredentials: true,
        MaxAge:           12 * time.Hour,
    }))
    r.GET("/health", func(c *gin.Context) {
        c.JSON(200, gin.H{"status": "ok", "db": db != nil, "redis": rdb != nil})
    })

    // Setup Auth Module
    authRepo := auth.NewRepository(db)
    authService := auth.NewService(authRepo, cfg.JWTSecret)
    authHandler := auth.NewHandler(authService)

    // Setup Learning Module
    lessonsRepo := lessons.NewRepository(db)
    lessonsService := lessons.NewService(lessonsRepo)
    lessonsHandler := lessons.NewHandler(lessonsService)

    // Setup Practice Module
    practiceRepo := practice.NewRepository(db)
    practiceService := practice.NewService(practiceRepo, genService)
    practiceHandler := practice.NewHandler(practiceService)

    extraHandler := extra.NewHandler(db.Database("vedicpath"), genService)

    // Register routes
    v1 := r.Group("/v1")
    {
        authGroup := v1.Group("/auth")
        {
            authGroup.POST("/register", authHandler.Register)
            authGroup.POST("/signup", authHandler.Register)
            authGroup.POST("/login", authHandler.Login)
            authGroup.POST("/google", extraHandler.GoogleLogin)
            authGroup.POST("/refresh", extraHandler.RefreshToken)
            authGroup.POST("/logout", extraHandler.Logout)
        }

        usersGroup := v1.Group("/users")
        {
            usersGroup.GET("/profile", extraHandler.GetProfile)
            usersGroup.PUT("/profile", extraHandler.UpdateProfile)
            usersGroup.PUT("/password", extraHandler.UpdatePassword)
        }
        
        curriculumGroup := v1.Group("/curriculum")
        {
            curriculumGroup.GET("/sutras", lessonsHandler.ListSutras)
            curriculumGroup.GET("/sutras/:sutraId", lessonsHandler.GetSutraWithLessons)
            curriculumGroup.GET("/sutras/:sutraId/lessons/:lessonNumber", lessonsHandler.GetLessonDetails)
        }
        
        lessonsGroup := v1.Group("/lessons")
        {
            lessonsGroup.GET("/sutras", lessonsHandler.ListSutras)
            lessonsGroup.GET("/sutras/:sutraID/lessons", lessonsHandler.GetLessons)
        }

        questionsGroup := v1.Group("/questions")
        {
            questionsGroup.GET("", extraHandler.GetQuestions)
            questionsGroup.POST("/:questionId/answer", extraHandler.SubmitAnswer)
        }

        practiceGroup := v1.Group("/practice")
        {
            practiceGroup.POST("/sutras/:sutraID/start", practiceHandler.StartSession)
            practiceGroup.GET("/next", practiceHandler.GetProblem)
            practiceGroup.POST("/submit", practiceHandler.SubmitAnswer)
            practiceGroup.GET("/sessions/:sessionId", extraHandler.GetSessionResults)
        }

        assessmentsGroup := v1.Group("/assessments")
        {
            assessmentsGroup.GET("/:assessmentId", extraHandler.GetAssessment)
            assessmentsGroup.POST("/:assessmentId/start", extraHandler.StartAssessment)
            assessmentsGroup.POST("/:assessmentId/submit", extraHandler.SubmitAssessment)
        }

        progressGroup := v1.Group("/progress")
        {
            progressGroup.GET("", extraHandler.GetProgress)
            progressGroup.GET("/lessons/:lessonId", extraHandler.GetLessonProgress)
            progressGroup.PUT("/lessons/:lessonId", extraHandler.UpdateLessonProgress)
        }

        v1.GET("/stats", extraHandler.GetStats)
        v1.GET("/stats/daily", extraHandler.GetDailyStats)
        v1.GET("/leaderboard", extraHandler.GetLeaderboard)

        gamesGroup := v1.Group("/games")
        {
            gamesGroup.GET("", extraHandler.ListGames)
            gamesGroup.POST("/:gameId/start", extraHandler.StartGame)
            gamesGroup.POST("/:gameId/submit-score", extraHandler.SubmitScore)
            gamesGroup.GET("/leaderboard", extraHandler.GetGameLeaderboard)
        }
    }

    log.Fatal(r.Run(":" + cfg.Port))
}
