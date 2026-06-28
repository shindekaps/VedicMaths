package practice

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

func (m *MockRepository) CreateSession(ctx context.Context, session *domain.PracticeSession) error {
	args := m.Called(ctx, session)
	return args.Error(0)
}

func TestStartSession(t *testing.T) {
	mockRepo := new(MockRepository)
	service := NewService(mockRepo)

	userID := uuid.New()
	sutraID := uuid.New()
	
	mockRepo.On("CreateSession", mock.Anything, mock.MatchedBy(func(s *domain.PracticeSession) bool {
		return s.UserID == userID && s.SutraID == sutraID
	})).Return(nil)

	sessionID, err := service.StartSession(context.Background(), userID, sutraID)
	assert.NoError(t, err)
	assert.NotEqual(t, uuid.Nil, sessionID)
	mockRepo.AssertExpectations(t)
}
