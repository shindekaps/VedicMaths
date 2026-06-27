package domain

import (
	"time"
	"github.com/google/uuid"
)

// PracticeSession tracks a student's practice activity
type PracticeSession struct {
	ID          uuid.UUID `bson:"_id"`
	UserID      uuid.UUID `bson:"user_id"`
	SutraID     uuid.UUID `bson:"sutra_id"`
	Score       int       `bson:"score"`
	Accuracy    float64   `bson:"accuracy"`
	DurationS   int       `bson:"duration_s"`
	CompletedAt time.Time `bson:"completed_at"`
}
