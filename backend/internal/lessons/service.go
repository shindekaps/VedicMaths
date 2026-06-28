package lessons

import (
	"context"
	"vedicpath/internal/domain"
)

// Service defines the interface for the learning engine
type Service interface {
	ListSutras(ctx context.Context) ([]domain.SutraDTO, error)
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
func (s *service) ListSutras(ctx context.Context) ([]domain.SutraDTO, error) {
	sutras, err := s.repo.GetAllSutras(ctx)
	if err != nil {
		return nil, err
	}
	
	var dtos []domain.SutraDTO
	for _, sutra := range sutras {
		dtos = append(dtos, domain.SutraDTO{
			ID:          sutra.ID.Hex(),
			Name:        sutra.Name,
			Slug:        sutra.Slug,
			Meaning:     sutra.Meaning,
			Description: sutra.Description,
			OrderIndex:  sutra.OrderIndex,
		})
	}
	return dtos, nil
}

// GetLessons fetches all lessons for a specific sutra
func (s *service) GetLessons(ctx context.Context, sutraID string) ([]domain.Lesson, error) {
	return s.repo.GetLessonsBySutra(ctx, sutraID)
}
