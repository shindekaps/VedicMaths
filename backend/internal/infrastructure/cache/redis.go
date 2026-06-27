package cache

import (
    "context"
    "log"
    "github.com/redis/go-redis/v9"
)

func Connect(redisURL string) *redis.Client {
    client := redis.NewClient(&redis.Options{
        Addr: redisURL,
    })

    _, err := client.Ping(context.Background()).Result()
    if err != nil {
        log.Fatal("Failed to connect to Redis:", err)
    }

    log.Println("Connected to Redis!")
    return client
}
