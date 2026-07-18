package domain

// Problem is a single generated practice question.
//
// Answer and SolutionSteps are tagged json:"-" because they must never be
// sent to the client with the question — only after the user submits an
// answer (or gives up) should the solution be revealed.
type Problem struct {
	ID            string      `json:"id"`
	SutraID       int         `json:"sutraId"`
	QuestionText  string      `json:"questionText"`
	Difficulty    int         `json:"difficulty"`
	Options       []string    `json:"options,omitempty"`
	DedupKey      string      `json:"-"`
	Answer        interface{} `json:"-"`
	SolutionSteps []string    `json:"-"`
}

// Result is what the client sees after submitting an answer.
type Result struct {
	Correct       bool        `json:"correct"`
	CorrectAnswer interface{} `json:"correctAnswer"`
	SolutionSteps []string    `json:"solutionSteps"`
}
