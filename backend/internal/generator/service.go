package generator

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"time"

	"github.com/google/uuid"
	"vedicpath/internal/domain"
)

const (
	maxDedupAttempts   = 40
	defaultAnswerTTL   = 15 * time.Minute
)

type Service struct {
	seen   SeenStore
	answer AnswerCache
}

func NewService(seen SeenStore, answer AnswerCache) *Service {
	return &Service{seen: seen, answer: answer}
}

// NextProblem generates a fresh, not-yet-seen problem for this user+sutra.
// The returned domain.Problem has Answer/SolutionSteps zeroed out by the
// caller before it's serialized to JSON (the struct tags already do this —
// see domain.Problem `json:"-"` tags) — only ID, SutraID, QuestionText,
// Difficulty reach the client.
func (s *Service) NextProblem(ctx context.Context, userID string, sutraID, difficulty int) (*domain.Problem, error) {
	gen, ok := Registry[sutraID]
	if !ok {
		return nil, fmt.Errorf("unknown sutra id %d", sutraID)
	}

	var p domain.Problem
	found := false
	for attempt := 0; attempt < maxDedupAttempts; attempt++ {
		candidate := gen(difficulty)
		seenBefore, err := s.seen.Has(ctx, userID, sutraID, candidate.DedupKey)
		if err != nil {
			return nil, err
		}
		if !seenBefore {
			p = candidate
			found = true
			break
		}
	}

	if !found {
		// Exhausted the practical number space for this user+sutra+difficulty.
		// Reset their history for this sutra and generate one fresh problem
		// rather than failing the request.
		if err := s.seen.Reset(ctx, userID, sutraID); err != nil {
			return nil, err
		}
		p = gen(difficulty)
	}

	p.ID = uuid.NewString()

	if err := s.seen.Mark(ctx, userID, sutraID, p.DedupKey); err != nil {
		return nil, err
	}
	if err := s.answer.Put(ctx, p.ID, p, defaultAnswerTTL); err != nil {
		return nil, err
	}

	return &p, nil
}

func (s *Service) GetQuestions(ctx context.Context, userID string, sutraID, difficulty, count int) ([]domain.Problem, error) {
	gen, ok := Registry[sutraID]
	if !ok {
		return nil, fmt.Errorf("unknown sutra id %d", sutraID)
	}

	var problems []domain.Problem
	for i := 0; i < count; i++ {
		var p domain.Problem
		found := false
		for attempt := 0; attempt < maxDedupAttempts; attempt++ {
			candidate := gen(difficulty)
			seenBefore, err := s.seen.Has(ctx, userID, sutraID, candidate.DedupKey)
			if err != nil {
				return nil, err
			}
			if !seenBefore {
				p = candidate
				found = true
				break
			}
		}
		if !found {
			p = gen(difficulty)
		}
		p.ID = uuid.NewString()
		_ = s.seen.Mark(ctx, userID, sutraID, p.DedupKey)
		_ = s.answer.Put(ctx, p.ID, p, defaultAnswerTTL)
		problems = append(problems, p)
	}
	return problems, nil
}

// SubmitAnswer validates a submitted answer against the cached problem.
// The problem is consumed on read (one-shot), so a problemID can't be
// resubmitted to fish for the right answer.
func (s *Service) SubmitAnswer(ctx context.Context, problemID string, submitted interface{}) (*domain.Result, error) {
	p, ok, err := s.answer.Take(ctx, problemID)
	if err != nil {
		return nil, err
	}
	if !ok {
		return nil, fmt.Errorf("problem %s not found or expired", problemID)
	}

	correct := answersMatch(p.Answer, submitted)

	return &domain.Result{
		Correct:       correct,
		CorrectAnswer: p.Answer,
		SolutionSteps: p.SolutionSteps,
	}, nil
}

// SubmitAnswerAndGetProblem validates a submitted answer and returns both the result and the original problem.
func (s *Service) SubmitAnswerAndGetProblem(ctx context.Context, problemID string, submitted interface{}) (*domain.Result, *domain.Problem, error) {
	p, ok, err := s.answer.Take(ctx, problemID)
	if err != nil {
		return nil, nil, err
	}
	if !ok {
		return nil, nil, fmt.Errorf("problem %s not found or expired", problemID)
	}

	correct := answersMatch(p.Answer, submitted)

	res := &domain.Result{
		Correct:       correct,
		CorrectAnswer: p.Answer,
		SolutionSteps: p.SolutionSteps,
	}
	return res, &p, nil
}

// answersMatch normalizes both sides through JSON so int/float64/map-key-order
// differences between what Go generated and what came in over the wire don't
// cause false negatives. Note: this means float answers need exact-match
// precision on the client side (fine for this app's 1-2 decimal answers).
func answersMatch(expected, submitted interface{}) bool {
	eb, err1 := json.Marshal(expected)
	sb, err2 := json.Marshal(submitted)
	if err1 != nil || err2 != nil {
		return false
	}
	return bytes.Equal(eb, sb)
}
