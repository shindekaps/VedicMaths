package lessons

import (
	"context"
	"testing"
	"vedicpath/internal/domain"

	"github.com/google/uuid"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/mock"
)

type MockRepository struct {
	mock.Mock
}

func (m *MockRepository) GetAllSutras(ctx context.Context) ([]domain.Sutra, error) {
	args := m.Called(ctx)
	return args.Get(0).([]domain.Sutra), args.Error(1)
}

func (m *MockRepository) GetLessonsBySutra(ctx context.Context, sutraID string) ([]domain.Lesson, error) {
	args := m.Called(ctx, sutraID)
	return args.Get(0).([]domain.Lesson), args.Error(1)
}

func TestListSutras(t *testing.T) {
	mockRepo := new(MockRepository)
	service := NewService(mockRepo)

	sutras := []domain.Sutra{{Name: "Test Sutra"}}
	mockRepo.On("GetAllSutras", mock.Anything).Return(sutras, nil)

	result, err := service.ListSutras(context.Background())
	assert.NoError(t, err)
	assert.Equal(t, sutras, result)
	mockRepo.AssertExpectations(t)
}

func TestGetLessons(t *testing.T) {
	mockRepo := new(MockRepository)
	service := NewService(mockRepo)

	sutraID := uuid.New().String()
	lessons := []domain.Lesson{{Title: "Test Lesson"}}
	mockRepo.On("GetLessonsBySutra", mock.Anything, sutraID).Return(lessons, nil)

	result, err := service.GetLessons(context.Background(), sutraID)
	assert.NoError(t, err)
	assert.Equal(t, lessons, result)
	mockRepo.AssertExpectations(t)
}
