package practice

import (
	"context"
	"time"
	"vedicpath/internal/domain"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

// Repository defines the interface for practice session database operations
type Repository interface {
	CreateSession(ctx context.Context, session *domain.PracticeSession) error
	SaveUserAnswer(ctx context.Context, answer *domain.UserAnswer) error
	GetLastAnswers(ctx context.Context, userID, sutraID primitive.ObjectID, limit int64) ([]domain.UserAnswer, error)
	UpdateUserProgress(ctx context.Context, progress *domain.UserProgress) error
	GetUserProgress(ctx context.Context, userID, sutraID, lessonID primitive.ObjectID) (*domain.UserProgress, error)
	GetSutraByID(ctx context.Context, sutraID primitive.ObjectID) (*domain.Sutra, error)
	GetSutraBySutraId(ctx context.Context, sutraID int) (*domain.Sutra, error)
}

type repository struct {
	sessionsColl *mongo.Collection
	answersColl  *mongo.Collection
	progressColl *mongo.Collection
}

// NewRepository initializes a new practice repository
func NewRepository(db *mongo.Client) Repository {
	database := db.Database("vedicpath")
	return &repository{
		sessionsColl: database.Collection("practice_sessions"),
		answersColl:  database.Collection("userAnswers"),
		progressColl: database.Collection("userProgress"),
	}
}

// CreateSession saves a new practice session to the database
func (r *repository) CreateSession(ctx context.Context, session *domain.PracticeSession) error {
	_, err := r.sessionsColl.InsertOne(ctx, session)
	return err
}

// SaveUserAnswer saves a user's answer submission
func (r *repository) SaveUserAnswer(ctx context.Context, answer *domain.UserAnswer) error {
	if answer.SubmittedAt.IsZero() {
		answer.SubmittedAt = time.Now()
	}
	_, err := r.answersColl.InsertOne(ctx, answer)
	return err
}

// GetLastAnswers retrieves the last N answers for a user and sutra
func (r *repository) GetLastAnswers(ctx context.Context, userID, sutraID primitive.ObjectID, limit int64) ([]domain.UserAnswer, error) {
	opts := options.Find().SetSort(bson.M{"submittedAt": -1}).SetLimit(limit)
	cursor, err := r.answersColl.Find(ctx, bson.M{"userId": userID, "sutraId": sutraID}, opts)
	if err != nil {
		return nil, err
	}
	defer cursor.Close(ctx)

	var answers []domain.UserAnswer
	if err := cursor.All(ctx, &answers); err != nil {
		return nil, err
	}
	return answers, nil
}

// UpdateUserProgress inserts or updates user progress details
func (r *repository) UpdateUserProgress(ctx context.Context, progress *domain.UserProgress) error {
	filter := bson.M{
		"userId":   progress.UserID,
		"sutraId":  progress.SutraID,
		"lessonId": progress.LessonID,
	}

	update := bson.M{
		"$set": progress,
	}
	opts := options.Update().SetUpsert(true)
	_, err := r.progressColl.UpdateOne(ctx, filter, update, opts)
	return err
}

// GetUserProgress fetches user progress for a specific lesson/sutra
func (r *repository) GetUserProgress(ctx context.Context, userID, sutraID, lessonID primitive.ObjectID) (*domain.UserProgress, error) {
	filter := bson.M{
		"userId":   userID,
		"sutraId":  sutraID,
		"lessonId": lessonID,
	}

	var progress domain.UserProgress
	err := r.progressColl.FindOne(ctx, filter).Decode(&progress)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			return nil, nil
		}
		return nil, err
	}
	return &progress, nil
}

// GetSutraByID fetches a sutra by its unique ObjectId
func (r *repository) GetSutraByID(ctx context.Context, sutraID primitive.ObjectID) (*domain.Sutra, error) {
	var sutra domain.Sutra
	err := r.sessionsColl.Database().Collection("sutras").FindOne(ctx, bson.M{"_id": sutraID}).Decode(&sutra)
	if err != nil {
		return nil, err
	}
	return &sutra, nil
}

// GetSutraBySutraId fetches a sutra by its numeric ID (1-16)
func (r *repository) GetSutraBySutraId(ctx context.Context, sutraID int) (*domain.Sutra, error) {
	var sutra domain.Sutra
	err := r.sessionsColl.Database().Collection("sutras").FindOne(ctx, bson.M{"sutraId": sutraID}).Decode(&sutra)
	if err != nil {
		return nil, err
	}
	return &sutra, nil
}
