package practice

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

// Handler interface defines the API contract for practice operations
type Handler interface {
	StartSession(c *gin.Context)
	GetProblem(c *gin.Context)
	SubmitAnswer(c *gin.Context)
}

type handler struct {
	service Service
}

// NewHandler initializes a new practice handler
func NewHandler(service Service) Handler {
	return &handler{service: service}
}

// StartSession handles the POST request to start a new practice session
func (h *handler) StartSession(c *gin.Context) {
	userIDStr := userIDFromContext(c)
	userID, _ := primitive.ObjectIDFromHex(userIDStr)
	if userID.IsZero() {
		// fallback to random object ID for anonymous user
		userID = primitive.NewObjectID()
	}

	sutraIDStr := c.Param("sutraID")
	if sutraIDStr == "" {
		sutraIDStr = c.Param("sutraId")
	}
	sutraID, err := primitive.ObjectIDFromHex(sutraIDStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid Sutra ID"})
		return
	}

	sessionID, err := h.service.StartSession(c.Request.Context(), userID, sutraID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to start session"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"sessionID": sessionID.Hex()})
}

// GetProblem handles the request to fetch the next dynamic problem
func (h *handler) GetProblem(c *gin.Context) {
	userID := userIDFromContext(c)

	sutraIDStr := c.Query("sutraId")
	if sutraIDStr == "" {
		sutraIDStr = c.Query("sutraID")
	}
	if sutraIDStr == "" {
		sutraIDStr = c.Param("sutraID")
	}

	sutraID, err := primitive.ObjectIDFromHex(sutraIDStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid Sutra ID"})
		return
	}

	difficulty, _ := strconv.Atoi(c.Query("difficulty"))
	if difficulty <= 0 {
		difficulty = 1
	}

	lessonID := c.Query("lessonId")
	if lessonID == "" {
		lessonID = c.Query("lessonID")
	}

	problem, err := h.service.GetNextProblem(c.Request.Context(), userID, sutraID, difficulty, lessonID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, problem)
}

// SubmitAnswer handles the answer evaluation and progress tracking
func (h *handler) SubmitAnswer(c *gin.Context) {
	userID := userIDFromContext(c)

	var req struct {
		SessionID  string      `json:"sessionId"`
		ProblemID  string      `json:"problemId"`
		UserAnswer interface{} `json:"answer"`
		SutraID    string      `json:"sutraId"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	sutraOID, _ := primitive.ObjectIDFromHex(req.SutraID)

	result, newDifficulty, err := h.service.EvaluateAnswer(c.Request.Context(), userID, sutraOID, req.SessionID, req.ProblemID, req.UserAnswer)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"correct":        result.Correct,
		"correctAnswer":  result.CorrectAnswer,
		"solutionSteps":  result.SolutionSteps,
		"new_difficulty": newDifficulty,
	})
}

func userIDFromContext(c *gin.Context) string {
	if v, exists := c.Get("userID"); exists {
		if s, ok := v.(string); ok {
			return s
		}
	}
	return "anonymous"
}
