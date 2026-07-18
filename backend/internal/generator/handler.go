package generator

import (
	"fmt"
	"math/rand"
	"net/http"
	"strconv"
	"time"

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

	lessonID := c.Query("lessonId")
	if lessonID == "" {
		lessonID = c.Query("lessonID")
	}

	problem, err := h.svc.NextProblem(c.Request.Context(), userID, sutraID, difficulty, lessonID)
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

func generateOptions(correctAnswer string) []gin.H {
	ansVal, err := strconv.Atoi(correctAnswer)
	if err != nil {
		return []gin.H{
			{"id": "A", "text": correctAnswer},
			{"id": "B", "text": correctAnswer + ".5"},
			{"id": "C", "text": "0.1428..."},
			{"id": "D", "text": "None of the above"},
		}
	}

	offsets := []int{10, -10, 100, -100, 5, -5, 20, -20, 1}
	distractors := make(map[string]bool)
	
	rand.Seed(time.Now().UnixNano())
	rand.Shuffle(len(offsets), func(i, j int) {
		offsets[i], offsets[j] = offsets[j], offsets[i]
	})

	for _, offset := range offsets {
		val := ansVal + offset
		if val > 0 && val != ansVal {
			valStr := strconv.Itoa(val)
			if !distractors[valStr] {
				distractors[valStr] = true
				if len(distractors) == 3 {
					break
				}
			}
		}
	}

	var distractorKeys []string
	for k := range distractors {
		distractorKeys = append(distractorKeys, k)
	}
	for len(distractorKeys) < 3 {
		distractorKeys = append(distractorKeys, strconv.Itoa(ansVal+len(distractorKeys)+2))
	}

	correctOptionIndex := rand.Intn(4)
	optionIDs := []string{"A", "B", "C", "D"}
	var optionsList []gin.H

	distractorIdx := 0
	for i := 0; i < 4; i++ {
		id := optionIDs[i]
		if i == correctOptionIndex {
			optionsList = append(optionsList, gin.H{"id": id, "text": correctAnswer})
		} else {
			optionsList = append(optionsList, gin.H{"id": id, "text": distractorKeys[distractorIdx]})
			distractorIdx++
		}
	}

	return optionsList
}

// GET /questions?sutraId=1&difficulty=1&count=10
func (h *Handler) GetQuestions(c *gin.Context) {
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
				sutraID = 1
			}
		} else {
			sutraID = 1
		}
	}

	difficulty, _ := strconv.Atoi(c.Query("difficulty"))
	if difficulty == 0 {
		difficulty = 1
	}

	count, _ := strconv.Atoi(c.Query("count"))
	if count <= 0 {
		count = 10
	}
	if count > 50 {
		count = 50
	}

	problems, err := h.svc.GetQuestions(c.Request.Context(), userID, sutraID, difficulty, count)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var questionsList []gin.H
	for _, p := range problems {
		ansStr := fmt.Sprintf("%v", p.Answer)
		qType := "short_answer"
		var opts []gin.H

		// 40% MCQs as per 3_QUESTIONS_ASSESSMENT_DATA.md specs
		if rand.Float32() < 0.40 {
			qType = "multiple_choice"
			opts = generateOptions(ansStr)
		}

		questionsList = append(questionsList, gin.H{
			"questionId": p.ID,
			"sutraId":    p.SutraID,
			"lessonId":   fmt.Sprintf("SUTRA_%d_LESSON_1", p.SutraID),
			"type":       qType,
			"difficulty": "medium",
			"question":   p.QuestionText,
			"options":    opts,
			"hints":      p.SolutionSteps,
			"points":     10,
			"timeLimit":  60,
		})
	}

	c.JSON(http.StatusOK, gin.H{
		"success":   true,
		"data":      gin.H{"questions": questionsList},
		"total":     len(questionsList),
		"sessionId": "SESSION_GEN_" + strconv.FormatInt(time.Now().Unix(), 10),
	})
}
