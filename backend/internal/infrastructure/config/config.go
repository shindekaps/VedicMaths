package config

import "github.com/spf13/viper"

type Config struct {
    Port        string
    MongoDBURI  string
    RedisURL    string
    JWTSecret   string
    Env         string
}

func Load() *Config {
    viper.AutomaticEnv()
    viper.SetDefault("PORT", "8080")
    return &Config{
        Port:        viper.GetString("PORT"),
        MongoDBURI:  viper.GetString("MONGODB_URI"),
        RedisURL:    viper.GetString("REDIS_URL"),
        JWTSecret:   viper.GetString("JWT_SECRET"),
        Env:         viper.GetString("ENV"),
    }
}
