package practice

import (
	"context"
	"vedicpath/internal/domain"

	"go.mongodb.org/mongo-driver/mongo"
)

// Repository defines the interface for practice session database operations
type Repository interface {
	CreateSession(ctx context.Context, session *domain.PracticeSession) error
}

type repository struct {
	collection *mongo.Collection
}

// NewRepository initializes a new practice repository
func NewRepository(db *mongo.Client) Repository {
	return &repository{
		collection: db.Database("vedicpath").Collection("practice_sessions"),
	}
}

// CreateSession saves a new practice session to the database
func (r *repository) CreateSession(ctx context.Context, session *domain.PracticeSession) error {
	_, err := r.collection.InsertOne(ctx, session)
	return err
}
