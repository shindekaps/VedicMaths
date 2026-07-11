package practice

import (
	"net/http"

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
	// In production, userID comes from JWT middleware context
	userID := primitive.NewObjectID()
	
	sutraIDStr := c.Param("sutraID")
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
	sutraID, err := primitive.ObjectIDFromHex(c.Param("sutraID"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid Sutra ID"})
		return
	}

	// In production, we'd fetch the user's current difficulty for this sutra
	difficulty := 1 

	problem, err := h.service.GetNextProblem(c.Request.Context(), sutraID, difficulty)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to generate problem"})
		return
	}

	c.JSON(http.StatusOK, problem)
}

// SubmitAnswer handles the answer evaluation and progress tracking
func (h *handler) SubmitAnswer(c *gin.Context) {
	var req struct {
		UserID        string `json:"user_id"`
		SutraID       string `json:"sutra_id"`
		SessionID     string `json:"session_id"`
		UserAnswer    string `json:"user_answer"`
		CorrectAnswer string `json:"correct_answer"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	userOID, err1 := primitive.ObjectIDFromHex(req.UserID)
	sutraOID, err2 := primitive.ObjectIDFromHex(req.SutraID)
	sessionOID, err3 := primitive.ObjectIDFromHex(req.SessionID)
	if err1 != nil || err2 != nil || err3 != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid hex string in request"})
		return
	}

	isCorrect, newDifficulty, err := h.service.EvaluateAnswer(c.Request.Context(), userOID, sutraOID, sessionOID, req.UserAnswer, req.CorrectAnswer)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Evaluation failed"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"correct":        isCorrect,
		"new_difficulty": newDifficulty,
	})
}
