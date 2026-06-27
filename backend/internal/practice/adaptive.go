package practice

import (
	"context"
	"github.com/google/uuid"
)

// DifficultyAdjuster defines the logic for adaptive difficulty
type DifficultyAdjuster interface {
	Adjust(ctx context.Context, userID, sutraID uuid.UUID, last10Correct []bool) (int, error)
}

type difficultyAdjuster struct {
	// In production, this would interact with the user_progress collection
}

// Adjust calculates new difficulty based on the last 10 problems
func (a *difficultyAdjuster) Adjust(ctx context.Context, userID, sutraID uuid.UUID, last10Correct []bool) (int, error) {
	if len(last10Correct) < 5 {
		return 1, nil // Default start
	}

	// Calculate accuracy over the last 10 (or fewer if less than 10 available)
	correctCount := 0
	for _, correct := range last10Correct {
		if correct {
			correctCount++
		}
	}
	accuracy := float64(correctCount) / float64(len(last10Correct))

	// Get current difficulty from database (stubbed)
	currentDifficulty := 1 

	// Adjustment Rules
	if accuracy >= 0.8 && currentDifficulty < 5 {
		return currentDifficulty + 1, nil
	} else if accuracy < 0.5 && currentDifficulty > 1 {
		return currentDifficulty - 1, nil
	}

	return currentDifficulty, nil
}
