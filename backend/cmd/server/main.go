package main

import (
    "log"
    "time"
    "vedicpath/internal/infrastructure/config"
    "vedicpath/internal/infrastructure/database"
    "vedicpath/internal/infrastructure/cache"
    "github.com/gin-gonic/gin"
    "github.com/gin-contrib/cors"
    "vedicpath/internal/auth"
    "vedicpath/internal/lessons"
    "vedicpath/internal/practice"
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
    practiceService := practice.NewService(practiceRepo)
    practiceHandler := practice.NewHandler(practiceService)

    // Register routes
    v1 := r.Group("/v1")
    {
        authGroup := v1.Group("/auth")
        {
            authGroup.POST("/register", authHandler.Register)
            authGroup.POST("/login", authHandler.Login)
        }
        
        lessonsGroup := v1.Group("/lessons")
        {
            lessonsGroup.GET("/sutras", lessonsHandler.ListSutras)
            lessonsGroup.GET("/sutras/:sutraID/lessons", lessonsHandler.GetLessons)
        }

        practiceGroup := v1.Group("/practice")
        {
            practiceGroup.POST("/sutras/:sutraID/start", practiceHandler.StartSession)
            practiceGroup.GET("/sutras/:sutraID/problem", practiceHandler.GetProblem)
        }
    }

    log.Fatal(r.Run(":" + cfg.Port))
}
