package database

import (
	"context"
	"encoding/json"
	"io/ioutil"
	"log"
	"path/filepath"
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

// Connect establishes a connection to MongoDB and returns a client
func Connect(uri string) *mongo.Client {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	client, err := mongo.Connect(ctx, options.Client().ApplyURI(uri))
	if err != nil {
		log.Fatal("Failed to connect to MongoDB:", err)
	}

	// Ping the database
	if err := client.Ping(ctx, nil); err != nil {
		log.Fatal("Failed to ping MongoDB:", err)
	}

	log.Println("Connected to MongoDB!")
	return client
}

type SeedSutra struct {
	Name        string `json:"name"`
	Slug        string `json:"slug"`
	Meaning     string `json:"meaning"`
	OrderIndex  int    `json:"order_index"`
}
type SeedLesson struct {
	Title      string `json:"title"`
	Content    string `json:"content"`
	OrderIndex int    `json:"order_index"`
}
type SeedData struct {
	Sutra   SeedSutra    `json:"sutra"`
	Lessons []SeedLesson `json:"lessons"`
}

// RunMigrations executes initial schema setup
func RunMigrations(db *mongo.Client, dbName string) error {
	log.Println("Running migrations...")
	
	sutrasCol := db.Database(dbName).Collection("sutras")
	lessonsCol := db.Database(dbName).Collection("lessons")

	// Adjust this path based on where you run the binary
	files, err := filepath.Glob("../../infra/mongodb/sutras/*.json")
	if err != nil {
		return err
	}

	ctx := context.Background()

	for _, file := range files {
		data, err := ioutil.ReadFile(file)
		if err != nil {
			log.Printf("Failed to read file %s: %v", file, err)
			continue
		}

		var seed SeedData
		if err := json.Unmarshal(data, &seed); err != nil {
			log.Printf("Failed to unmarshal %s: %v", file, err)
			continue
		}

		// Insert Sutra
		sutra := struct {
			ID          primitive.ObjectID `bson:"_id"`
			Name        string             `bson:"name"`
			Slug        string             `bson:"slug"`
			Meaning     string             `bson:"meaning"`
			OrderIndex  int                `bson:"order_index"`
		}{
			ID:         primitive.NewObjectID(),
			Name:       seed.Sutra.Name,
			Slug:       seed.Sutra.Slug,
			Meaning:    seed.Sutra.Meaning,
			OrderIndex: seed.Sutra.OrderIndex,
		}
		_, err = sutrasCol.InsertOne(ctx, sutra)
		if err != nil {
			log.Printf("Failed to insert sutra %s: %v", seed.Sutra.Name, err)
			continue
		}

		// Insert Lessons
		for _, l := range seed.Lessons {
			lesson := struct {
				ID         primitive.ObjectID `bson:"_id"`
				SutraID    primitive.ObjectID `bson:"sutra_id"`
				Title      string             `bson:"title"`
				Content    string             `bson:"content"`
				OrderIndex int                `bson:"order_index"`
			}{
				ID:         primitive.NewObjectID(),
				SutraID:    sutra.ID,
				Title:      l.Title,
				Content:    l.Content,
				OrderIndex: l.OrderIndex,
			}
			_, err = lessonsCol.InsertOne(ctx, lesson)
			if err != nil {
				log.Printf("Failed to insert lesson %s: %v", l.Title, err)
			}
		}
		log.Printf("Seeded sutra: %s", seed.Sutra.Name)
	}

	return nil
}
