package lessons

import (
	"context"
	"github.com/yourorg/vedicpath/internal/domain"
)

// Service defines the interface for the learning engine
type Service interface {
	ListSutras(ctx context.Context) ([]domain.Sutra, error)
	GetLessons(ctx context.Context, sutraID string) ([]domain.Lesson, error)
}

type service struct {
	repo Repository
}

// NewService initializes a new learning service
func NewService(repo Repository) Service {
	return &service{repo: repo}
}

// ListSutras fetches all available sutras using the repository
func (s *service) ListSutras(ctx context.Context) ([]domain.Sutra, error) {
	return s.repo.GetAllSutras(ctx)
}

// GetLessons fetches all lessons for a specific sutra
func (s *service) GetLessons(ctx context.Context, sutraID string) ([]domain.Lesson, error) {
	return s.repo.GetLessonsBySutra(ctx, sutraID)
}
