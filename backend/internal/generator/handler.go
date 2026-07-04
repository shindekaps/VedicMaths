package generator

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
)

type Handler struct {
	svc *Service
}

func NewHandler(svc *Service) *Handler {
	return &Handler{svc: svc}
}

// GET /practice/next?sutraId=3&difficulty=2
func (h *Handler) NextProblem(c *gin.Context) {
	userID := userIDFromContext(c)
	sutraID, _ := strconv.Atoi(c.Query("sutraId"))
	difficulty, _ := strconv.Atoi(c.Query("difficulty"))
	if difficulty == 0 {
		difficulty = 1
	}

	problem, err := h.svc.NextProblem(c.Request.Context(), userID, sutraID, difficulty)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, problem)
}

type submitAnswerRequest struct {
	ProblemID string      `json:"problemId"`
	Answer    interface{} `json:"answer"`
}

// POST /practice/submit  { "problemId": "...", "answer": ... }
func (h *Handler) SubmitAnswer(c *gin.Context) {
	var req submitAnswerRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "bad request"})
		return
	}

	result, err := h.svc.SubmitAnswer(c.Request.Context(), req.ProblemID, req.Answer)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, result)
}

func userIDFromContext(c *gin.Context) string {
	// Replace with your real JWT-derived user ID lookup.
	if v, exists := c.Get("userID"); exists {
		if s, ok := v.(string); ok {
			return s
		}
	}
	return "anonymous"
}
