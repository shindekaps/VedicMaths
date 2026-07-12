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

// UserAnswer represents a single answered problem
type UserAnswer struct {
	ID              primitive.ObjectID `bson:"_id,omitempty" json:"id"`
	UserID          primitive.ObjectID `bson:"userId" json:"userId"`
	QuestionID      string             `bson:"questionId" json:"questionId"` // String since dynamic generator uses UUID
	LessonID        primitive.ObjectID `bson:"lessonId,omitempty" json:"lessonId,omitempty"`
	SutraID         primitive.ObjectID `bson:"sutraId" json:"sutraId"`
	AttemptNumber   int                `bson:"attemptNumber" json:"attemptNumber"`
	UserAnswer      string             `bson:"userAnswer" json:"userAnswer"`
	IsCorrect       bool               `bson:"isCorrect" json:"isCorrect"`
	TimeSpent       int                `bson:"timeSpent" json:"timeSpent"`
	HintsUsed       []string           `bson:"hintsUsed" json:"hintsUsed"`
	MarkedForReview bool               `bson:"markedForReview" json:"markedForReview"`
	SubmittedAt     time.Time          `bson:"submittedAt" json:"submittedAt"`
	SessionID       string             `bson:"sessionId" json:"sessionId"`
	SessionType     string             `bson:"sessionType" json:"sessionType"` // "lesson", "practice", "assessment"
}

// UserProgress tracks a user's progress on lessons/sutras
type UserProgress struct {
	ID              primitive.ObjectID `bson:"_id,omitempty" json:"id"`
	UserID          primitive.ObjectID `bson:"userId" json:"userId"`
	SutraID         primitive.ObjectID `bson:"sutraId" json:"sutraId"`
	LessonID        primitive.ObjectID `bson:"lessonId" json:"lessonId"`
	LessonNumber    int                `bson:"lessonNumber" json:"lessonNumber"`
	SutraNumber     int                `bson:"sutraNumber" json:"sutraNumber"`
	Status          string             `bson:"status" json:"status"` // "not_started", "in_progress", "completed"
	CompletedAt     *time.Time         `bson:"completedAt,omitempty" json:"completedAt,omitempty"`
	TimeSpent       int                `bson:"timeSpent" json:"timeSpent"` // in seconds
	BestScore       float64            `bson:"bestScore" json:"bestScore"` // percentage
	LastAttemptDate time.Time          `bson:"lastAttemptDate" json:"lastAttemptDate"`
	IsFavorite      bool               `bson:"isFavorite" json:"isFavorite"`
	Notes           string             `bson:"notes" json:"notes"`
	CreatedAt       time.Time          `bson:"createdAt" json:"createdAt"`
	UpdatedAt       time.Time          `bson:"updatedAt" json:"updatedAt"`
}
