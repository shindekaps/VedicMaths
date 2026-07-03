package domain

import (
	"go.mongodb.org/mongo-driver/bson/primitive"
)

// Sutra represents a Vedic Mathematics Sutra
// Sutra represents a Vedic Mathematics Sutra
type Sutra struct {
	ID             primitive.ObjectID   `bson:"_id" json:"id"`
	Name           string               `bson:"name" json:"name"`
	Slug           string               `bson:"slug" json:"slug"`
	Meaning        string               `bson:"meaning" json:"meaning"`
	Description    string               `bson:"description" json:"description"`
	OrderIndex     int                  `bson:"order_index" json:"order_index"`
	PrerequisiteID *primitive.ObjectID  `bson:"prerequisite_id,omitempty" json:"prerequisite_id,omitempty"`
}

type Lesson struct {
	ID          primitive.ObjectID `bson:"_id" json:"id"`
	SutraID     primitive.ObjectID `bson:"sutra_id" json:"sutra_id"`
	Title       string             `bson:"title" json:"title"`
	Content     string             `bson:"content" json:"content"`
	OrderIndex  int                `bson:"order_index" json:"order_index"`
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
