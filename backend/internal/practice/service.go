package practice

import (
	"context"
	"fmt"
	"time"
	"vedicpath/internal/domain"
	"vedicpath/internal/generator"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

// Service defines the business logic for practice sessions
type Service interface {
	StartSession(ctx context.Context, userID, sutraID primitive.ObjectID) (primitive.ObjectID, error)
	GetNextProblem(ctx context.Context, userID string, sutraID primitive.ObjectID, difficulty int, lessonID string) (*domain.Problem, error)
	EvaluateAnswer(ctx context.Context, userID string, sutraID primitive.ObjectID, sessionID string, problemID string, userAnswer interface{}) (*domain.Result, int, error)
}

type service struct {
	repo     Repository
	genSvc   *generator.Service
	adjuster DifficultyAdjuster
}

// NewService initializes a production-ready practice service with generator service dependency
func NewService(repo Repository, genSvc *generator.Service) Service {
	return &service{
		repo:     repo,
		genSvc:   genSvc,
		adjuster: &difficultyAdjuster{},
	}
}

// StartSession creates a new practice session entry in the database
func (s *service) StartSession(ctx context.Context, userID, sutraID primitive.ObjectID) (primitive.ObjectID, error) {
	sessionID := primitive.NewObjectID()
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
func (s *service) GetNextProblem(ctx context.Context, userID string, sutraID primitive.ObjectID, difficulty int, lessonID string) (*domain.Problem, error) {
	// 1. Fetch sutra from DB using sutraID
	sutra, err := s.repo.GetSutraByID(ctx, sutraID)
	if err != nil {
		return nil, err
	}

	// 2. Call generator service to get the next problem
	return s.genSvc.NextProblem(ctx, userID, sutra.SutraId, difficulty, lessonID)
}

func (s *service) EvaluateAnswer(ctx context.Context, userID string, sutraID primitive.ObjectID, sessionID string, problemID string, userAnswer interface{}) (*domain.Result, int, error) {
	// 1. Check answer using the generator service
	result, problem, err := s.genSvc.SubmitAnswerAndGetProblem(ctx, problemID, userAnswer)
	if err != nil {
		return nil, 0, err
	}

	if sutraID.IsZero() && problem != nil {
		sutra, err := s.repo.GetSutraBySutraId(ctx, problem.SutraID)
		if err == nil && sutra != nil {
			sutraID = sutra.ID
		}
	}

	userOID, _ := primitive.ObjectIDFromHex(userID)

	// 2. Save user answer log
	ansStr := ""
	if userAnswerStr, ok := userAnswer.(string); ok {
		ansStr = userAnswerStr
	} else {
		ansStr = fmt.Sprintf("%v", userAnswer)
	}

	userAns := &domain.UserAnswer{
		UserID:      userOID,
		QuestionID:  problemID,
		SutraID:     sutraID,
		UserAnswer:  ansStr,
		IsCorrect:   result.Correct,
		SubmittedAt: time.Now(),
		SessionID:   sessionID,
		SessionType: "practice",
	}
	_ = s.repo.SaveUserAnswer(ctx, userAns)

	// 3. Update User Progress in MongoDB
	sutra, err := s.repo.GetSutraByID(ctx, sutraID)
	if err == nil {
		progress, progErr := s.repo.GetUserProgress(ctx, userOID, sutraID, primitive.NilObjectID)
		if progErr == nil {
			if progress == nil {
				progress = &domain.UserProgress{
					UserID:          userOID,
					SutraID:         sutraID,
					LessonID:        primitive.NilObjectID,
					SutraNumber:     sutra.SutraId,
					Status:          "in_progress",
					CreatedAt:       time.Now(),
					LastAttemptDate: time.Now(),
				}
			}
			progress.LastAttemptDate = time.Now()
			progress.UpdatedAt = time.Now()

			// Update rolling score/accuracy logic
			lastAnswers, lastAnswersErr := s.repo.GetLastAnswers(ctx, userOID, sutraID, 10)
			if lastAnswersErr == nil && len(lastAnswers) > 0 {
				correctCount := 0
				for _, a := range lastAnswers {
					if a.IsCorrect {
						correctCount++
					}
				}
				progress.BestScore = (float64(correctCount) / float64(len(lastAnswers))) * 100.0
			}

			_ = s.repo.UpdateUserProgress(ctx, progress)
		}
	}

	// 4. Trigger adaptive difficulty adjustment if threshold reached
	newDifficulty := 1
	last10Correct := []bool{}
	lastAnswers, lastAnswersErr := s.repo.GetLastAnswers(ctx, userOID, sutraID, 10)
	if lastAnswersErr == nil {
		for _, a := range lastAnswers {
			last10Correct = append(last10Correct, a.IsCorrect)
		}
	}

	if len(last10Correct) > 0 {
		newDifficulty, _ = s.adjuster.Adjust(ctx, userOID, sutraID, last10Correct)
	}

	return result, newDifficulty, nil
}
