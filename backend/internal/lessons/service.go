package lessons

import (
	"context"
	"strings"
	"vedicpath/internal/domain"
)

// Service defines the interface for the learning engine
type Service interface {
	ListSutras(ctx context.Context) ([]domain.SutraDTO, error)
	GetLessons(ctx context.Context, sutraID string) ([]domain.Lesson, error)
	GetSutraWithLessons(ctx context.Context, sutraIdOrHex string) (domain.SutraWithLessonsDTO, error)
	GetLessonDetails(ctx context.Context, sutraIdOrHex string, lessonNum int) (domain.Lesson, error)
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
		slug := strings.ToLower(strings.ReplaceAll(sutra.Name, " ", "-"))
		slug = strings.ReplaceAll(slug, "--", "-")
		slug = strings.ReplaceAll(slug, ",", "")

		dtos = append(dtos, domain.SutraDTO{
			ID:             sutra.ID.Hex(),
			SutraId:        sutra.SutraId,
			Name:           sutra.Name,
			SanskritName:   sutra.SanskritName,
			Description:    sutra.Description,
			Order:          sutra.Order,
			Difficulty:     sutra.Difficulty,
			EstimatedHours: sutra.EstimatedHours,
			Icon:           sutra.Icon,
			Color:          sutra.Color,
			Slug:           slug,
		})
	}
	return dtos, nil
}

// GetLessons fetches all lessons for a specific sutra
func (s *service) GetLessons(ctx context.Context, sutraID string) ([]domain.Lesson, error) {
	return s.repo.GetLessonsBySutra(ctx, sutraID)
}

func (s *service) GetSutraWithLessons(ctx context.Context, sutraIdOrHex string) (domain.SutraWithLessonsDTO, error) {
	sutra, err := s.repo.GetSutraByIdOrHex(ctx, sutraIdOrHex)
	if err != nil {
		return domain.SutraWithLessonsDTO{}, err
	}

	lessons, err := s.repo.GetLessonsBySutraID(ctx, sutra.ID)
	if err != nil {
		return domain.SutraWithLessonsDTO{}, err
	}

	var lessonSummaries []domain.LessonSummaryDTO
	for _, l := range lessons {
		lessonSummaries = append(lessonSummaries, domain.LessonSummaryDTO{
			LessonId:         l.LessonId,
			LessonNumber:     l.LessonNumber,
			Title:            l.Title,
			Description:      l.Description,
			EstimatedMinutes: l.EstimatedMinutes,
			Difficulty:       l.Difficulty,
		})
	}

	return domain.SutraWithLessonsDTO{
		ID:             sutra.ID.Hex(),
		SutraId:        sutra.SutraId,
		Name:           sutra.Name,
		SanskritName:   sutra.SanskritName,
		Description:    sutra.Description,
		Difficulty:     sutra.Difficulty,
		EstimatedHours: sutra.EstimatedHours,
		Icon:           sutra.Icon,
		Color:          sutra.Color,
		Lessons:        lessonSummaries,
	}, nil
}

func (s *service) GetLessonDetails(ctx context.Context, sutraIdOrHex string, lessonNum int) (domain.Lesson, error) {
	sutra, err := s.repo.GetSutraByIdOrHex(ctx, sutraIdOrHex)
	if err != nil {
		return domain.Lesson{}, err
	}

	return s.repo.GetLessonByNumber(ctx, sutra.ID, lessonNum)
}
