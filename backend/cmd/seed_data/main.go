package main

import (
	"log"
	"vedicpath/internal/infrastructure/config"
	"vedicpath/internal/infrastructure/database"
)

func main() {
	cfg := config.Load()
	db := database.Connect(cfg.MongoDBURI)
	if err := database.RunMigrations(db, "vedicpath"); err != nil {
		log.Fatalf("Failed to run migrations and seed data: %v", err)
	}
	log.Println("Database successfully migrated and seeded with rich Vedic Math curriculum!")
}
