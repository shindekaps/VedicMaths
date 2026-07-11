package generator

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

type Handler struct {
	svc *Service
	db  *mongo.Database
}

func NewHandler(svc *Service, db *mongo.Database) *Handler {
	return &Handler{svc: svc, db: db}
}

// GET /practice/next?sutraId=3&difficulty=2
func (h *Handler) NextProblem(c *gin.Context) {
	userID := userIDFromContext(c)
	
	sutraIDStr := c.Query("sutraId")
	if sutraIDStr == "" {
		sutraIDStr = c.Query("sutraID")
	}

	var sutraID int
	if id, err := strconv.Atoi(sutraIDStr); err == nil {
		sutraID = id
	} else {
		if objID, err := primitive.ObjectIDFromHex(sutraIDStr); err == nil {
			var sutra struct {
				SutraId int `bson:"sutraId"`
			}
			err := h.db.Collection("sutras").FindOne(c.Request.Context(), bson.M{"_id": objID}).Decode(&sutra)
			if err == nil {
				sutraID = sutra.SutraId
			} else {
				c.JSON(http.StatusBadRequest, gin.H{"error": "sutra not found in database"})
				return
			}
		} else {
			c.JSON(http.StatusBadRequest, gin.H{"error": "invalid sutraId format"})
			return
		}
	}

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
