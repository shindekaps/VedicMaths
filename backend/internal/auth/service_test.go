package auth

import (
	"context"
	"testing"
	"vedicpath/internal/domain"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/mock"
)

// MockRepository is a mock implementation of auth.Repository
type MockRepository struct {
	mock.Mock
}

func (m *MockRepository) Create(ctx context.Context, user *domain.User) error {
	args := m.Called(ctx, user)
	return args.Error(0)
}

func (m *MockRepository) GetByEmail(ctx context.Context, email string) (*domain.User, error) {
	args := m.Called(ctx, email)
	if args.Get(0) == nil {
		return nil, args.Error(1)
	}
	return args.Get(0).(*domain.User), args.Error(1)
}

func TestRegister(t *testing.T) {
	mockRepo := new(MockRepository)
	service := NewService(mockRepo, "test-secret")

	mockRepo.On("Create", mock.Anything, mock.Anything).Return(nil)

	err := service.Register(context.Background(), "test@example.com", "password123", "testuser", 1)
	assert.NoError(t, err)
	mockRepo.AssertExpectations(t)
}
