package config

import (
	"log"
	"github.com/spf13/viper"
)

type Config struct {
	Port        string
	MongoDBURI  string
	RedisURL    string
	JWTSecret   string
	Env         string
}

func Load() *Config {
	viper.SetConfigFile(".env")
	if err := viper.ReadInConfig(); err != nil {
		log.Printf("Error reading .env file: %v", err)
	}
	
	viper.AutomaticEnv()
	
	return &Config{
		Port:        viper.GetString("PORT"),
		MongoDBURI:  viper.GetString("MONGODB_URI"),
		RedisURL:    viper.GetString("REDIS_URL"),
		JWTSecret:   viper.GetString("JWT_SECRET"),
		Env:         viper.GetString("ENV"),
	}
}
