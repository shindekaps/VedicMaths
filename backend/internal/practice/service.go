package practice

import (
	"context"
	"time"
	"vedicpath/internal/domain"

	"github.com/google/uuid"
)

type service struct {
	repo Repository
}

// NewService initializes a new practice service
func NewService(repo Repository) Service {
	return &service{repo: repo}
}

// StartSession creates a new practice session for a user
func (s *service) StartSession(ctx context.Context, userID, sutraID uuid.UUID) (uuid.UUID, error) {
	sessionID := uuid.New()
	session := &domain.PracticeSession{
		ID:          sessionID,
		UserID:      userID,
		SutraID:     sutraID,
		CompletedAt: time.Now(),
	}

	err := s.repo.CreateSession(ctx, session)
	return sessionID, err
}
