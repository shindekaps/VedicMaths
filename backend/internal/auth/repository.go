package auth

import (
    "context"
    "github.com/yourorg/vedicpath/internal/domain"
    "go.mongodb.org/mongo-driver/mongo"
)

type Repository interface {
    Create(ctx context.Context, user *domain.User) error
    GetByEmail(ctx context.Context, email string) (*domain.User, error)
}

type repository struct {
    collection *mongo.Collection
}

func NewRepository(db *mongo.Client) Repository {
    return &repository{
        collection: db.Database("vedicpath").Collection("users"),
    }
}

func (r *repository) Create(ctx context.Context, user *domain.User) error {
    _, err := r.collection.InsertOne(ctx, user)
    return err
}

func (r *repository) GetByEmail(ctx context.Context, email string) (*domain.User, error) {
    var user domain.User
    err := r.collection.FindOne(ctx, map[string]string{"email": email}).Decode(&user)
    if err != nil {
        return nil, err
    }
    return &user, nil
}
