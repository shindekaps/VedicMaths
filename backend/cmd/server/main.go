package main

import (
    "log"
    "github.com/yourorg/vedicpath/internal/infrastructure/config"
    "github.com/yourorg/vedicpath/internal/infrastructure/database"
    "github.com/yourorg/vedicpath/internal/infrastructure/cache"
    "github.com/gin-gonic/gin"
    "github.com/yourorg/vedicpath/internal/auth"
    "github.com/yourorg/vedicpath/internal/lessons"
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
    }

    log.Fatal(r.Run(":" + cfg.Port))
}
