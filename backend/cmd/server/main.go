package main

import (
    "log"
    "vedicpath/internal/infrastructure/config"
    "vedicpath/internal/infrastructure/database"
    "vedicpath/internal/infrastructure/cache"
    "github.com/gin-gonic/gin"
    "vedicpath/internal/auth"
    "vedicpath/internal/lessons"
    "vedicpath/internal/practice"
)

func main() {
    cfg := config.Load()
    // MongoDB connection setup will be added in infrastructure/database/db.go
    db := database.Connect(cfg.MongoDBURI)
    rdb := cache.Connect(cfg.RedisURL)

    r := gin.Default()
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
        }
    }

    log.Fatal(r.Run(":" + cfg.Port))
}
