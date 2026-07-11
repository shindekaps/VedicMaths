package database

import (
	"context"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"path/filepath"
	"time"

	"go.mongodb.org/mongo-driver/bson"
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

// RunMigrations executes initial schema setup and indexing
func RunMigrations(db *mongo.Client, dbName string) error {
	log.Println("Running migrations...")
	database := db.Database(dbName)
	ctx := context.Background()

	// Clean up legacy collections to prevent unique index build errors on stale data
	_ = database.Collection("sutras").Drop(ctx)
	_ = database.Collection("lessons").Drop(ctx)

	// Define collections and their indexes
	collections := map[string][]mongo.IndexModel{
		"users": {
			{Keys: bson.D{{"email", 1}}, Options: options.Index().SetUnique(true)},
			{Keys: bson.D{{"googleId", 1}}, Options: options.Index().SetSparse(true)},
			{Keys: bson.D{{"createdAt", -1}}},
		},
		"sutras": {
			{Keys: bson.D{{"sutraId", 1}}, Options: options.Index().SetUnique(true)},
			{Keys: bson.D{{"order", 1}}},
			{Keys: bson.D{{"difficulty", 1}}},
		},
		"lessons": {
			{Keys: bson.D{{"lessonId", 1}}, Options: options.Index().SetUnique(true)},
			{Keys: bson.D{{"sutraId", 1}}},
			{Keys: bson.D{{"sutraNumber", 1}, {"lessonNumber", 1}}},
			{Keys: bson.D{{"order", 1}}},
		},
		"questions": {
			{Keys: bson.D{{"questionId", 1}}, Options: options.Index().SetUnique(true)},
			{Keys: bson.D{{"sutraId", 1}}},
			{Keys: bson.D{{"lessonId", 1}}},
			{Keys: bson.D{{"sutraNumber", 1}, {"lessonNumber", 1}}},
			{Keys: bson.D{{"difficulty", 1}}},
			{Keys: bson.D{{"type", 1}}},
		},
		"userProgress": {
			{Keys: bson.D{{"userId", 1}, {"sutraId", 1}, {"lessonId", 1}}, Options: options.Index().SetUnique(true)},
			{Keys: bson.D{{"userId", 1}, {"status", 1}}},
			{Keys: bson.D{{"userId", 1}, {"completedAt", -1}}},
			{Keys: bson.D{{"userId", 1}, {"sutraNumber", 1}}},
		},
		"userAnswers": {
			{Keys: bson.D{{"userId", 1}, {"submittedAt", -1}}},
			{Keys: bson.D{{"sessionId", 1}}},
			{Keys: bson.D{{"userId", 1}, {"questionId", 1}}},
			{Keys: bson.D{{"userId", 1}, {"sessionType", 1}}},
		},
		"assessments": {
			{Keys: bson.D{{"assessmentId", 1}}, Options: options.Index().SetUnique(true)},
			{Keys: bson.D{{"sutraId", 1}}},
			{Keys: bson.D{{"sutraNumber", 1}}},
		},
		"userAssessmentResults": {
			{Keys: bson.D{{"userId", 1}, {"completedAt", -1}}},
			{Keys: bson.D{{"userId", 1}, {"sutraId", 1}}},
			{Keys: bson.D{{"assessmentId", 1}}},
			{Keys: bson.D{{"userId", 1}, {"passed", 1}}},
		},
		"userBadges": {
			{Keys: bson.D{{"userId", 1}}},
			{Keys: bson.D{{"userId", 1}, {"badgeId", 1}}, Options: options.Index().SetUnique(true)},
		},
		"leaderboard": {
			{Keys: bson.D{{"totalXP", -1}}},
			{Keys: bson.D{{"lessonsCompleted", -1}}},
			{Keys: bson.D{{"userId", 1}}, Options: options.Index().SetUnique(true)},
		},
		"gameSessions": {
			{Keys: bson.D{{"userId", 1}, {"completedAt", -1}}},
			{Keys: bson.D{{"userId", 1}, {"gameType", 1}}},
			{Keys: bson.D{{"sutraId", 1}}},
		},
	}

	for colName, indexes := range collections {
		_, err := database.Collection(colName).Indexes().CreateMany(ctx, indexes)
		if err != nil {
			return fmt.Errorf("failed to create indexes for %s: %w", colName, err)
		}
		log.Printf("Initialized indexes for collection: %s", colName)
	}

	// Seeding Logic (adjust paths if necessary)
	log.Println("Seeding sutras and lessons...")
	sutrasCol := database.Collection("sutras")
	lessonsCol := database.Collection("lessons")

	files, err := filepath.Glob("../infra/mongodb/sutras/*.json")
	if err != nil {
		return err
	}

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
		sutra := bson.M{
			"sutraId":        seed.Sutra.SutraId,
			"name":           seed.Sutra.Name,
			"sanskritName":   seed.Sutra.SanskritName,
			"description":    seed.Sutra.Description,
			"order":          seed.Sutra.Order,
			"difficulty":     seed.Sutra.Difficulty,
			"estimatedHours": seed.Sutra.EstimatedHours,
			"icon":           seed.Sutra.Icon,
			"color":          seed.Sutra.Color,
			"createdAt":      time.Now(),
			"updatedAt":      time.Now(),
		}
		result, err := sutrasCol.InsertOne(ctx, sutra)
		if err != nil {
			log.Printf("Failed to insert sutra %s: %v", seed.Sutra.Name, err)
			continue
		}

		sutraID := result.InsertedID

		// Insert Lessons
		for _, l := range seed.Lessons {
			examplesBSON := []bson.M{}
			for _, ex := range l.Examples {
				examplesBSON = append(examplesBSON, bson.M{
					"problem":     ex.Problem,
					"solution":    ex.Solution,
					"steps":       ex.Steps,
					"explanation": ex.Explanation,
				})
			}

			lesson := bson.M{
				"lessonId":         l.LessonId,
				"sutraId":          sutraID,
				"sutraNumber":      seed.Sutra.SutraId,
				"lessonNumber":     l.LessonNumber,
				"title":            l.Title,
				"description":      l.Description,
				"content":          l.Content,
				"examples":         examplesBSON,
				"difficulty":       l.Difficulty,
				"estimatedMinutes": l.EstimatedMinutes,
				"videoUrl":         l.VideoUrl,
				"order":            l.Order,
				"isActive":         true,
				"createdAt":        time.Now(),
				"updatedAt":        time.Now(),
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

type SeedSutra struct {
	SutraId        int     `json:"sutraId"`
	Name           string  `json:"name"`
	SanskritName   string  `json:"sanskritName"`
	Description    string  `json:"description"`
	Order          int     `json:"order"`
	Difficulty     string  `json:"difficulty"`
	EstimatedHours float64 `json:"estimatedHours"`
	Icon           string  `json:"icon"`
	Color          string  `json:"color"`
}

type SeedExample struct {
	Problem     string   `json:"problem"`
	Solution    string   `json:"solution"`
	Steps       []string `json:"steps"`
	Explanation string   `json:"explanation"`
}

type SeedLesson struct {
	LessonId         string        `json:"lessonId"`
	LessonNumber     int           `json:"lessonNumber"`
	Title            string        `json:"title"`
	Description      string        `json:"description"`
	Content          string        `json:"content"`
	Examples         []SeedExample `json:"examples"`
	Difficulty       string        `json:"difficulty"`
	EstimatedMinutes int           `json:"estimatedMinutes"`
	VideoUrl         string        `json:"videoUrl"`
	Order            int           `json:"order"`
}

type SeedData struct {
	Sutra   SeedSutra    `json:"sutra"`
	Lessons []SeedLesson `json:"lessons"`
}
