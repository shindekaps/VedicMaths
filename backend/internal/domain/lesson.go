package domain

import (
	"github.com/google/uuid"
)

// Sutra represents a Vedic Mathematics Sutra
type Sutra struct {
	ID             uuid.UUID `bson:"_id"`
	Name           string    `bson:"name"`
	Slug           string    `bson:"slug"` // URL-friendly identifier
	Meaning        string    `bson:"meaning"`
	Description    string    `bson:"description"`
	OrderIndex     int       `bson:"order_index"`
	PrerequisiteID *uuid.UUID `bson:"prerequisite_id,omitempty"`
}

// Lesson represents a specific lesson within a Sutra
type Lesson struct {
	ID          uuid.UUID `bson:"_id"`
	SutraID     uuid.UUID `bson:"sutra_id"`
	Title       string    `bson:"title"`
	Content     string    `bson:"content"` // Markdown or structured content
	OrderIndex  int       `bson:"order_index"`
}
