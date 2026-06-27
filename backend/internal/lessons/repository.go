package lessons

import (
	"context"
	"vedicpath/internal/domain"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
)

// Repository defines the interface for database operations related to lessons and sutras
type Repository interface {
	GetAllSutras(ctx context.Context) ([]domain.Sutra, error)
	GetLessonsBySutra(ctx context.Context, sutraID string) ([]domain.Lesson, error)
}

type repository struct {
	sutrasCollection  *mongo.Collection
	lessonsCollection *mongo.Collection
}

// NewRepository initializes a new lessons repository
func NewRepository(db *mongo.Client) Repository {
	dbName := "vedicpath"
	return &repository{
		sutrasCollection:  db.Database(dbName).Collection("sutras"),
		lessonsCollection: db.Database(dbName).Collection("lessons"),
	}
}

// GetAllSutras retrieves all available sutras from the database
func (r *repository) GetAllSutras(ctx context.Context) ([]domain.Sutra, error) {
	cursor, err := r.sutrasCollection.Find(ctx, bson.M{})
	if err != nil {
		return nil, err
	}
	defer cursor.Close(ctx)

	var sutras []domain.Sutra
	if err := cursor.All(ctx, &sutras); err != nil {
		return nil, err
	}
	return sutras, nil
}

// GetLessonsBySutra retrieves all lessons associated with a given Sutra ID
func (r *repository) GetLessonsBySutra(ctx context.Context, sutraID string) ([]domain.Lesson, error) {
	// Need to convert string ID to appropriate type if necessary, assuming string for now
	filter := bson.M{"sutra_id": sutraID}
	cursor, err := r.lessonsCollection.Find(ctx, filter)
	if err != nil {
		return nil, err
	}
	defer cursor.Close(ctx)

	var lessons []domain.Lesson
	if err := cursor.All(ctx, &lessons); err != nil {
		return nil, err
	}
	return lessons, nil
}
