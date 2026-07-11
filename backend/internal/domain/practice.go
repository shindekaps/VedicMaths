package domain

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

// PracticeSession tracks a student's practice activity
type PracticeSession struct {
	ID          primitive.ObjectID `bson:"_id" json:"id"`
	UserID      primitive.ObjectID `bson:"user_id" json:"user_id"`
	SutraID     primitive.ObjectID `bson:"sutra_id" json:"sutra_id"`
	Score       int                `bson:"score" json:"score"`
	Accuracy    float64            `bson:"accuracy" json:"accuracy"`
	DurationS   int                `bson:"duration_s" json:"duration_s"`
	CompletedAt time.Time          `bson:"completed_at" json:"completed_at"`
}
