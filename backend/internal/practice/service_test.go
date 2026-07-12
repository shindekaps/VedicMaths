package practice

import (
	"context"
	"testing"
	"vedicpath/internal/domain"
	"vedicpath/internal/generator"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/mock"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type MockRepository struct {
	mock.Mock
}

func (m *MockRepository) CreateSession(ctx context.Context, session *domain.PracticeSession) error {
	args := m.Called(ctx, session)
	return args.Error(0)
}

func (m *MockRepository) SaveUserAnswer(ctx context.Context, answer *domain.UserAnswer) error {
	args := m.Called(ctx, answer)
	return args.Error(0)
}

func (m *MockRepository) GetLastAnswers(ctx context.Context, userID, sutraID primitive.ObjectID, limit int64) ([]domain.UserAnswer, error) {
	args := m.Called(ctx, userID, sutraID, limit)
	if args.Get(0) == nil {
		return nil, args.Error(1)
	}
	return args.Get(0).([]domain.UserAnswer), args.Error(1)
}

func (m *MockRepository) UpdateUserProgress(ctx context.Context, progress *domain.UserProgress) error {
	args := m.Called(ctx, progress)
	return args.Error(0)
}

func (m *MockRepository) GetUserProgress(ctx context.Context, userID, sutraID, lessonID primitive.ObjectID) (*domain.UserProgress, error) {
	args := m.Called(ctx, userID, sutraID, lessonID)
	if args.Get(0) == nil {
		return nil, args.Error(1)
	}
	return args.Get(0).(*domain.UserProgress), args.Error(1)
}

func (m *MockRepository) GetSutraByID(ctx context.Context, sutraID primitive.ObjectID) (*domain.Sutra, error) {
	args := m.Called(ctx, sutraID)
	if args.Get(0) == nil {
		return nil, args.Error(1)
	}
	return args.Get(0).(*domain.Sutra), args.Error(1)
}

func (m *MockRepository) GetSutraBySutraId(ctx context.Context, sutraID int) (*domain.Sutra, error) {
	args := m.Called(ctx, sutraID)
	if args.Get(0) == nil {
		return nil, args.Error(1)
	}
	return args.Get(0).(*domain.Sutra), args.Error(1)
}

func TestStartSession(t *testing.T) {
	mockRepo := new(MockRepository)
	seenStore := generator.NewInMemorySeenStore()
	answerCache := generator.NewInMemoryAnswerCache()
	genSvc := generator.NewService(seenStore, answerCache)
	service := NewService(mockRepo, genSvc)

	userID := primitive.NewObjectID()
	sutraID := primitive.NewObjectID()

	mockRepo.On("CreateSession", mock.Anything, mock.MatchedBy(func(s *domain.PracticeSession) bool {
		return s.UserID == userID && s.SutraID == sutraID
	})).Return(nil)

	sessionID, err := service.StartSession(context.Background(), userID, sutraID)
	assert.NoError(t, err)
	assert.False(t, sessionID.IsZero())
	mockRepo.AssertExpectations(t)
}
