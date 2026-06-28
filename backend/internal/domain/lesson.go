package domain

import (
	"go.mongodb.org/mongo-driver/bson/primitive"
)

// Sutra represents a Vedic Mathematics Sutra
type Sutra struct {
	ID             primitive.ObjectID   `bson:"_id"`
	Name           string               `bson:"name"`
	Slug           string               `bson:"slug"`
	Meaning        string               `bson:"meaning"`
	Description    string               `bson:"description"`
	OrderIndex     int                  `bson:"order_index"`
	PrerequisiteID *primitive.ObjectID  `bson:"prerequisite_id,omitempty"`
}

type Lesson struct {
	ID          primitive.ObjectID `bson:"_id"`
	SutraID     primitive.ObjectID `bson:"sutra_id"`
	Title       string             `bson:"title"`
	Content     string             `bson:"content"`
	OrderIndex  int                `bson:"order_index"`
}

// SutraDTO is used for JSON serialization
type SutraDTO struct {
	ID          string  `json:"id"`
	Name        string  `json:"name"`
	Slug        string  `json:"slug"`
	Meaning     string  `json:"meaning"`
	Description string  `json:"description"`
	OrderIndex  int     `json:"order_index"`
}
