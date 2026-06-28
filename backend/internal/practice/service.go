package practice

import (
	"context"
	"errors"
	"time"
	"vedicpath/internal/domain"

	"github.com/google/uuid"
)

// Service defines the business logic for practice sessions
type Service interface {
	StartSession(ctx context.Context, userID, sutraID uuid.UUID) (uuid.UUID, error)
	GetNextProblem(ctx context.Context, sutraID uuid.UUID, difficulty int) (*Problem, error)
	EvaluateAnswer(ctx context.Context, userID, sutraID, sessionID uuid.UUID, userAnswer string, correctAnswer string) (bool, int, error)
}

// Problem represents a generated math question for the API
type Problem struct {
	Question   string `json:"question"`
	Answer     string `json:"answer"` // In production, we might not send this to the client
	Difficulty int    `json:"difficulty"`
}

type service struct {
	repo       Repository
	generators map[string]Generator
}

// NewService initializes a production-ready practice service with generators
func NewService(repo Repository) Service {
	return &service{
		repo: repo,
		generators: map[string]Generator{
			"ekadhikena-purvena":       &EkadhikenaGenerator{},
			"nikhilam-navatashcaramam": &NikhilamGenerator{},
		},
	}
}

// StartSession creates a new practice session entry in the database
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

// GetNextProblem selects the correct generator and produces a dynamic problem
func (s *service) GetNextProblem(ctx context.Context, sutraID uuid.UUID, difficulty int) (*Problem, error) {
	// In production, we would fetch the sutra slug from the DB using sutraID
	// For now, assuming a default or mapping
	sutraSlug := "nikhilam-navatashcaramam" // Mock mapping
	
	generator, ok := s.generators[sutraSlug]
	if !ok {
		return nil, errors.New("no generator found for this sutra")
	}

	q, a := generator.Generate(difficulty)
	return &Problem{
		Question:   q,
		Answer:     a,
		Difficulty: difficulty,
	}, nil
}

// EvaluateAnswer handles the logic for checking correctness and updating progress
func (s *service) EvaluateAnswer(ctx context.Context, userID, sutraID, sessionID uuid.UUID, userAnswer string, correctAnswer string) (bool, int, error) {
	isCorrect := userAnswer == correctAnswer

	// TODO: Production DB updates
	// 1. Record problem result in practice_sessions problem history
	// 2. Update user_progress rolling accuracy
	// 3. Trigger adaptive difficulty adjustment if threshold reached

	return isCorrect, 1, nil // Returning mock difficulty for now
}
