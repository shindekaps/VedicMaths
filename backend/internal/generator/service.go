package generator

import (
	"context"
	"encoding/json"
	"fmt"
	"math/rand"
	"strconv"
	"strings"
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
func (s *Service) NextProblem(ctx context.Context, userID string, sutraID, difficulty int, lessonID string) (*domain.Problem, error) {
	fmt.Printf("[DEBUG] NextProblem: sutraID=%d, difficulty=%d, lessonID=%q\n", sutraID, difficulty, lessonID)
	gen, ok := Registry[sutraID]
	if !ok {
		return nil, fmt.Errorf("unknown sutra id %d", sutraID)
	}

	var p domain.Problem
	found := false
	for attempt := 0; attempt < maxDedupAttempts; attempt++ {
		var candidate domain.Problem
		if sutraID == 1 {
			candidate = genSutra1WithLesson(difficulty, lessonID)
		} else {
			candidate = gen(difficulty)
		}

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
		if sutraID == 1 {
			p = genSutra1WithLesson(difficulty, lessonID)
		} else {
			p = gen(difficulty)
		}
	}

	p.ID = uuid.NewString()
	if len(p.Options) == 0 {
		p.Options = generateMCQOptionsForProblem(p.Answer)
	}

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
			var candidate domain.Problem
			if sutraID == 1 {
				candidate = genSutra1WithLesson(difficulty, "")
			} else {
				candidate = gen(difficulty)
			}

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
			if sutraID == 1 {
				p = genSutra1WithLesson(difficulty, "")
			} else {
				p = gen(difficulty)
			}
		}
		p.ID = uuid.NewString()
		if len(p.Options) == 0 {
			p.Options = generateMCQOptionsForProblem(p.Answer)
		}
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

func answersMatch(expected, submitted interface{}) bool {
	return normalizeValue(expected) == normalizeValue(submitted)
}

func normalizeValue(v interface{}) string {
	if v == nil {
		return ""
	}
	switch val := v.(type) {
	case string:
		return strings.TrimSpace(val)
	case int:
		return fmt.Sprintf("%d", val)
	case int64:
		return fmt.Sprintf("%d", val)
	case float64:
		return fmt.Sprintf("%g", val)
	default:
		b, err := json.Marshal(v)
		if err != nil {
			return ""
		}
		s := string(b)
		if len(s) >= 2 && s[0] == '"' && s[len(s)-1] == '"' {
			s = s[1 : len(s)-1]
		}
		return strings.TrimSpace(s)
	}
}

func generateMCQOptionsForProblem(answer interface{}) []string {
	var ansVal int
	var isNumeric bool

	switch val := answer.(type) {
	case int:
		ansVal = val
		isNumeric = true
	case int64:
		ansVal = int(val)
		isNumeric = true
	case float64:
		ansVal = int(val)
		isNumeric = true
	case string:
		if parsed, err := strconv.Atoi(val); err == nil {
			ansVal = parsed
			isNumeric = true
		} else {
			isNumeric = false
		}
	default:
		isNumeric = false
	}

	if !isNumeric {
		ansStr := fmt.Sprintf("%v", answer)
		return shuffleStrings([]string{ansStr, ansStr + ".5", "0.1428", "None of the above"})
	}

	set := make(map[string]bool)
	ansStr := strconv.Itoa(ansVal)
	set[ansStr] = true

	offsets := []int{10, -10, 100, -100, 5, -5, 20, -20, 1, 2, 3}
	rand.Shuffle(len(offsets), func(i, j int) {
		offsets[i], offsets[j] = offsets[j], offsets[i]
	})

	for _, offset := range offsets {
		val := ansVal + offset
		if val > 0 && val != ansVal {
			set[strconv.Itoa(val)] = true
			if len(set) == 4 {
				break
			}
		}
	}

	for len(set) < 4 {
		val := ansVal + len(set) + 2
		set[strconv.Itoa(val)] = true
	}

	var options []string
	for k := range set {
		options = append(options, k)
	}

	return shuffleStrings(options)
}

func shuffleStrings(slice []string) []string {
	rand.Shuffle(len(slice), func(i, j int) {
		slice[i], slice[j] = slice[j], slice[i]
	})
	return slice
}
