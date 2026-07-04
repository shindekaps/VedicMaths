package main

import (
	"context"
	"encoding/json"
	"log"
	"os"
	"time"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

type Sutra struct {
	ID             int    `bson:"_id" json:"_id"`
	Slug           string `bson:"slug" json:"slug"`
	SanskritName   string `bson:"sanskritName" json:"sanskritName"`
	EnglishMeaning string `bson:"englishMeaning" json:"englishMeaning"`
	OrderIndex     int    `bson:"orderIndex" json:"orderIndex"`
}

type Lesson struct {
	SutraSlug  string       `json:"sutra_slug"`
	Title      string       `json:"title"`
	Steps      []LessonStep `json:"steps"`
	OrderIndex int          `json:"order_index"`
}

type LessonStep struct {
	Type string      `json:"type"`
	Data interface{} `json:"data"`
}

func main() {
	uri := "mongodb://localhost:27017"
	dbName := "vedicpath"

	ctx, cancel := context.WithTimeout(context.Background(), 30*time.Second)
	defer cancel()

	client, err := mongo.Connect(ctx, options.Client().ApplyURI(uri))
	if err != nil {
		log.Fatalf("connect: %v", err)
	}
	defer client.Disconnect(ctx)

	db := client.Database(dbName)

	// Seed Sutras
	sutraData, err := os.ReadFile("C:/kapil/project/VedicMaths/infra/mongodb/go-mongo/go-mongo/data/sutras_seed.json")
	if err != nil {
		log.Fatalf("Error reading sutras_seed.json: %v", err)
	}
	var sutras []Sutra
	json.Unmarshal(sutraData, &sutras)

	sutraColl := db.Collection("sutras")
	sutraColl.Drop(ctx)

	sutraDocs := make([]interface{}, len(sutras))
	for i, s := range sutras {
		sutraDocs[i] = s
	}
	if len(sutraDocs) > 0 {
		_, err = sutraColl.InsertMany(ctx, sutraDocs)
		if err != nil {
			log.Fatalf("Error inserting sutras: %v", err)
		}
	}
	log.Printf("Inserted %d sutras", len(sutras))

	// Seed Lessons
	lessonData, err := os.ReadFile("C:/kapil/project/VedicMaths/infra/mongodb/seed_lessons.json")
	if err != nil {
		log.Fatalf("Error reading seed_lessons.json: %v", err)
	}
	var lessons []Lesson
	json.Unmarshal(lessonData, &lessons)

	lessonColl := db.Collection("lessons")
	lessonColl.Drop(ctx)

	for _, l := range lessons {
		var s Sutra
		err := sutraColl.FindOne(ctx, bson.M{"slug": l.SutraSlug}).Decode(&s)
		if err != nil {
			log.Printf("Warning: Sutra not found for slug %s: %v", l.SutraSlug, err)
			continue
		}

		doc := bson.M{
			"sutra_id":    int32(s.ID),
			"title":       l.Title,
			"steps":       l.Steps,
			"order_index": l.OrderIndex,
		}
		_, err = lessonColl.InsertOne(ctx, doc)
		if err != nil {
			log.Printf("Error inserting lesson: %v", err)
		}
	}
	log.Printf("Inserted %d lessons", len(lessons))
}
