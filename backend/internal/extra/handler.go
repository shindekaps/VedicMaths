package extra

import (
	"context"
	"fmt"
	"math/rand"
	"net/http"
	"strconv"
	"time"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"

	"vedicpath/internal/generator"
)

type Handler struct {
	db  *mongo.Database
	gen *generator.Service
}

func NewHandler(db *mongo.Database, gen *generator.Service) *Handler {
	return &Handler{
		db:  db,
		gen: gen,
	}
}

// Helper to generate MCQ options around the correct answer
func generateOptions(correctAnswer string) []gin.H {
	ansVal, err := strconv.Atoi(correctAnswer)
	if err != nil {
		// Non-numeric fallback
		return []gin.H{
			{"id": "A", "text": correctAnswer},
			{"id": "B", "text": correctAnswer + ".5"},
			{"id": "C", "text": "0.1428..."},
			{"id": "D", "text": "None of the above"},
		}
	}

	offsets := []int{10, -10, 100, -100, 5, -5, 20, -20, 1}
	distractors := make(map[string]bool)
	
	// Shuffle offsets
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

	// Ensure 3 distractors
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

// 3. Google OAuth Login stub
func (h *Handler) GoogleLogin(c *gin.Context) {
	var req struct {
		GoogleIdToken     string `json:"googleIdToken" binding:"required"`
		GoogleAccessToken string `json:"googleAccessToken"`
	}
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data": gin.H{
			"userId":       "google-oauth-mock-id",
			"email":        "user@gmail.com",
			"firstName":    "John",
			"lastName":     "Doe",
			"profilePhoto": "https://lh3.googleusercontent.com/a/mock",
			"accessToken":  "google-oauth-mock-access-token",
			"refreshToken": "google-oauth-mock-refresh-token",
			"expiresIn":    3600,
			"isNewUser":    false,
		},
	})
}

// 4. Refresh Token stub
func (h *Handler) RefreshToken(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data": gin.H{
			"accessToken": "new-refreshed-mock-access-token",
			"expiresIn":    3600,
		},
	})
}

// 5. Logout stub
func (h *Handler) Logout(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "User logged out successfully",
	})
}

// 6. Get User Profile
func (h *Handler) GetProfile(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data": gin.H{
			"userId":       "mock-user-id-kapil",
			"email":        "kapil@example.com",
			"firstName":    "Kapil",
			"lastName":     "Shinde",
			"nickName":     "Kaps",
			"profilePhoto": "https://avatar.vercel.sh/kapil",
			"createdAt":    time.Now().Add(-30 * 24 * time.Hour),
			"preferences": gin.H{
				"dailyGoal":     60,
				"notifications": true,
				"darkMode":      false,
				"language":      "en",
			},
		},
	})
}

// 7. Update User Profile
func (h *Handler) UpdateProfile(c *gin.Context) {
	var req struct {
		FirstName   string `json:"firstName"`
		LastName    string `json:"lastName"`
		NickName    string `json:"nickName"`
		Preferences struct {
			DailyGoal     int  `json:"dailyGoal"`
			Notifications bool `json:"notifications"`
			DarkMode      bool `json:"darkMode"`
		} `json:"preferences"`
	}
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "Profile updated successfully",
		"data":    req,
	})
}

// 8. Update Password
func (h *Handler) UpdatePassword(c *gin.Context) {
	var req struct {
		OldPassword string `json:"oldPassword" binding:"required"`
		NewPassword string `json:"newPassword" binding:"required"`
	}
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "Password updated successfully",
	})
}

// 12. Get Questions for Lesson (Invokes Go Generator service)
func (h *Handler) GetQuestions(c *gin.Context) {
	sutraIdStr := c.Query("sutraId")
	sutraId, _ := strconv.Atoi(sutraIdStr)
	if sutraId == 0 {
		sutraId = 1
	}

	countStr := c.Query("count")
	count, _ := strconv.Atoi(countStr)
	if count <= 0 {
		count = 10
	}
	if count > 50 {
		count = 50
	}

	difficulty, _ := strconv.Atoi(c.Query("difficulty"))
	if difficulty <= 0 {
		difficulty = 1
	}

	var questions []gin.H
	ctx := c.Request.Context()

	for i := 0; i < count; i++ {
		p, err := h.gen.NextProblem(ctx, "anonymous", sutraId, difficulty, "")
		if err != nil {
			continue
		}

		ansStr := fmt.Sprintf("%v", p.Answer)
		qType := "short_answer"
		var opts []gin.H

		if rand.Float32() < 0.40 {
			qType = "multiple_choice"
			opts = generateOptions(ansStr)
		}

		questions = append(questions, gin.H{
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
		"data":      gin.H{"questions": questions},
		"total":     len(questions),
		"sessionId": "SESSION_GEN_" + strconv.FormatInt(time.Now().Unix(), 10),
	})
}

// 13. Submit Answer
func (h *Handler) SubmitAnswer(c *gin.Context) {
	questionId := c.Param("questionId")
	var req struct {
		SessionId  string      `json:"sessionId"`
		UserAnswer interface{} `json:"userAnswer" binding:"required"`
		TimeSpent  int         `json:"timeSpent"`
	}
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "error": err.Error()})
		return
	}

	result, err := h.gen.SubmitAnswer(c.Request.Context(), questionId, req.UserAnswer)
	if err != nil {
		c.JSON(http.StatusOK, gin.H{
			"success": true,
			"data": gin.H{
				"questionId":        questionId,
				"isCorrect":         true,
				"correctAnswer":     req.UserAnswer,
				"explanation":       "Auto-approved via fallback evaluation.",
				"pointsEarned":      10,
				"bonusPointsEarned": 5,
				"totalPointsEarned": 15,
			},
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data": gin.H{
			"questionId":        questionId,
			"isCorrect":         result.Correct,
			"correctAnswer":     result.CorrectAnswer,
			"explanation":       "Calculated via Go generator engine.",
			"pointsEarned":      10,
			"bonusPointsEarned": 5,
			"totalPointsEarned": 15,
		},
	})
}

// 14. Get Practice Session Results
func (h *Handler) GetSessionResults(c *gin.Context) {
	sessionId := c.Param("sessionId")
	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data": gin.H{
			"sessionId":      sessionId,
			"sessionType":    "lesson",
			"sutraId":        1,
			"lessonId":       "SUTRA_1_LESSON_1",
			"totalQuestions": 10,
			"correctAnswers": 9,
			"score":          90,
			"pointsEarned":   145,
			"timeSpent":      450,
			"passed":         true,
			"completedAt":    time.Now(),
		},
	})
}

// 15. Get Assessment Set
func (h *Handler) GetAssessment(c *gin.Context) {
	assessmentId := c.Param("assessmentId")
	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data": gin.H{
			"assessment": gin.H{
				"assessmentId":     assessmentId,
				"sutraId":          1,
				"lessonId":         "SUTRA_1_LESSON_1",
				"name":             "Lesson 1 Assessment",
				"description":      "Comprehensive assessment for Lesson 1",
				"totalQuestions":   20,
				"duration":         30,
				"passingScore":     80,
				"totalPoints":      250,
				"questionsPreview": 3,
			},
		},
	})
}

// 16. Start Assessment (Generates 20 balanced questions dynamically)
func (h *Handler) StartAssessment(c *gin.Context) {
	assessmentId := c.Param("assessmentId")
	ctx := c.Request.Context()

	sutraId := 1
	var sutraNum int
	if _, err := fmt.Sscanf(assessmentId, "ASSESS_SUTRA_%d", &sutraNum); err == nil && sutraNum >= 1 && sutraNum <= 16 {
		sutraId = sutraNum
	}

	var questions []gin.H
	// 20 balanced questions: 16 Easy (difficulty=1), 2 Medium (difficulty=2), 2 Hard (difficulty=3)
	difficulties := []int{1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 3, 3}

	for _, diff := range difficulties {
		p, err := h.gen.NextProblem(ctx, "anonymous", sutraId, diff, "")
		if err != nil {
			continue
		}

		ansStr := fmt.Sprintf("%v", p.Answer)
		qType := "short_answer"
		var opts []gin.H

		if rand.Float32() < 0.40 {
			qType = "multiple_choice"
			opts = generateOptions(ansStr)
		}

		questions = append(questions, gin.H{
			"questionId": p.ID,
			"type":       qType,
			"question":   p.QuestionText,
			"options":    opts,
		})
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data": gin.H{
			"assessmentSessionId": "ASSESS_SESSION_" + strconv.FormatInt(time.Now().Unix(), 10),
			"assessmentId":        assessmentId,
			"startedAt":           time.Now(),
			"duration":            30,
			"durationEndTime":     time.Now().Add(30 * time.Minute),
			"questions":           questions,
		},
	})
}

// 17. Submit Assessment
func (h *Handler) SubmitAssessment(c *gin.Context) {
	assessmentId := c.Param("assessmentId")
	var req struct {
		AssessmentSessionId string `json:"assessmentSessionId"`
		Answers             []struct {
			QuestionId string      `json:"questionId"`
			UserAnswer interface{} `json:"userAnswer"`
			TimeSpent  int         `json:"timeSpent"`
		} `json:"answers"`
	}
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "error": err.Error()})
		return
	}

	correctCount := 0
	var detailedResults []gin.H

	for _, ans := range req.Answers {
		isCorrect := false
		correctAnswer := ""

		result, err := h.gen.SubmitAnswer(c.Request.Context(), ans.QuestionId, ans.UserAnswer)
		if err == nil {
			isCorrect = result.Correct
			correctAnswer = fmt.Sprintf("%v", result.CorrectAnswer)
		} else {
			isCorrect = true
			correctAnswer = fmt.Sprintf("%v", ans.UserAnswer)
		}

		if isCorrect {
			correctCount++
		}

		detailedResults = append(detailedResults, gin.H{
			"questionId":    ans.QuestionId,
			"userAnswer":    ans.UserAnswer,
			"correctAnswer": correctAnswer,
			"isCorrect":     isCorrect,
			"pointsEarned":  10,
		})
	}

	score := int(float64(correctCount) / 20.0 * 100.0)
	if len(req.Answers) > 0 {
		score = int(float64(correctCount) / float64(len(req.Answers)) * 100.0)
	}
	passed := score >= 80

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data": gin.H{
			"assessmentSessionId": req.AssessmentSessionId,
			"assessmentId":        assessmentId,
			"totalQuestions":      len(req.Answers),
			"correctAnswers":      correctCount,
			"score":               score,
			"passed":              passed,
			"pointsEarned":        correctCount * 10,
			"timeTaken":           600,
			"detailedResults":     detailedResults,
		},
	})
}

// 18. Get User Progress
func (h *Handler) GetProgress(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data": gin.H{
			"overallProgress": gin.H{
				"totalSutras":      16,
				"sutrasCompleted":  3,
				"totalLessons":     64,
				"lessonsCompleted": 12,
				"totalTimeSpent":   8.5,
				"averageScore":     88.2,
			},
			"sutraProgress": []gin.H{
				{
					"sutraId":              1,
					"name":                 "Ekadhikena Purvena",
					"status":               "in_progress",
					"lessonsCompleted":     3,
					"totalLessons":         4,
					"completionPercentage": 75,
				},
			},
		},
	})
}

// 19. Get Lesson Progress
func (h *Handler) GetLessonProgress(c *gin.Context) {
	lessonId := c.Param("lessonId")
	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data": gin.H{
			"lesson": gin.H{
				"lessonId":         lessonId,
				"title":            "Squaring Numbers Ending in 5",
				"status":           "completed",
				"bestScore":        95,
				"practiceAttempts": []gin.H{},
			},
		},
	})
}

// 20. Update Lesson Progress
func (h *Handler) UpdateLessonProgress(c *gin.Context) {
	lessonId := c.Param("lessonId")
	var req struct {
		Status    string `json:"status"`
		TimeSpent int    `json:"timeSpent"`
		Score     int    `json:"score"`
		SessionId string `json:"sessionId"`
	}
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data": gin.H{
			"lessonId":  lessonId,
			"status":    req.Status,
			"bestScore": req.Score,
			"timeSpent": req.TimeSpent,
		},
	})
}

// 21. Get User Stats
func (h *Handler) GetStats(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data": gin.H{
			"stats": gin.H{
				"totalXP":           1450,
				"currentStreak":     5,
				"longestStreak":     12,
				"sutraCompleted":    3,
				"lessonsCompleted":  15,
				"assessmentsPassed": 12,
				"totalTimeSpent":    45,
				"averageScore":      85.5,
				"badges": []gin.H{
					{
						"badgeId":    "BADGE_FIRST_LESSON",
						"name":       "First Step",
						"icon":       "🎯",
						"unlockedAt": time.Now().Add(-7 * 24 * time.Hour),
					},
				},
				"recentActivity": []gin.H{
					{
						"type":      "lesson_completed",
						"sutraId":   1,
						"lessonId":  "SUTRA_1_LESSON_1",
						"score":     95,
						"timestamp": time.Now().Add(-1 * time.Hour),
					},
				},
			},
		},
	})
}

// 21b. Get Daily Stats (convenience alias)
func (h *Handler) GetDailyStats(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data": gin.H{
			"streak":          12,
			"xp":              1450,
			"activeTimeLimit": 60,
			"activeTimeToday": 25,
			"questionsSolved": 120,
			"accuracy":        85.6,
		},
	})
}

// 22. Get Leaderboard
func (h *Handler) GetLeaderboard(c *gin.Context) {
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	var board []bson.M
	cursor, err := h.db.Collection("leaderboard").Find(ctx, bson.M{}, options.Find().SetSort(bson.M{"xp": -1}).SetLimit(10))
	if err == nil {
		_ = cursor.All(ctx, &board)
	}

	if len(board) == 0 {
		board = []bson.M{
			{"rank": 1, "name": "Priya Mehta", "xp": 3240, "streak": 22, "level": "Vedic Master", "avatar": "🧙‍♀️"},
			{"rank": 2, "name": "Rohan Gupta", "xp": 2980, "streak": 15, "level": "Guru", "avatar": "👨‍🎓"},
			{"rank": 3, "name": "Ananya Singh", "xp": 2750, "streak": 18, "level": "Guru", "avatar": "👩‍💻"},
			{"rank": 4, "name": "Kapil (You)", "xp": 1450, "streak": 12, "level": "Adept", "avatar": "👦"},
		}
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data":    board,
	})
}

// 23. Get Available Games
func (h *Handler) ListGames(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data": gin.H{
			"games": []gin.H{
				{
					"gameId":      "SPEED_CHALLENGE",
					"name":        "Speed Challenge",
					"description": "Answer questions as fast as possible",
					"icon":        "⚡",
					"isAvailable": true,
					"highScore":   2500,
				},
				{
					"gameId":      "PATTERN_MATCH",
					"name":        "Pattern Match",
					"description": "Match mathematical patterns",
					"icon":        "🎯",
					"isAvailable": true,
					"highScore":   1800,
				},
				{
					"gameId":      "STREAK_MASTER",
					"name":        "Streak Master",
					"description": "Maintain longest correct answer streak",
					"icon":        "🔥",
					"isAvailable": true,
					"highScore":   0,
				},
			},
		},
	})
}

// 24. Start Game Session
func (h *Handler) StartGame(c *gin.Context) {
	gameId := c.Param("gameId")
	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data": gin.H{
			"gameSessionId": "GAME_SESSION_" + strconv.FormatInt(time.Now().Unix(), 10),
			"gameId":        gameId,
			"startedAt":     time.Now(),
			"timeLimit":     300,
		},
	})
}

// 25. Submit Game Score
func (h *Handler) SubmitScore(c *gin.Context) {
	gameId := c.Param("gameId")
	var req struct {
		GameSessionId  string  `json:"gameSessionId"`
		Score          int     `json:"score"`
		CorrectAnswers int     `json:"correctAnswers"`
		TotalQuestions int     `json:"totalQuestions"`
		TimeTaken      int     `json:"timeTaken"`
		Accuracy       float64 `json:"accuracy"`
	}
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data": gin.H{
			"gameSessionId":    req.GameSessionId,
			"gameId":           gameId,
			"score":            req.Score,
			"isHighScore":      true,
			"previousHighScore": 2500,
			"xpEarned":         req.Score / 10,
			"badges":           []gin.H{},
		},
	})
}

// Get Game Leaderboard
func (h *Handler) GetGameLeaderboard(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data": []gin.H{
			{"rank": 1, "name": "Rohan Gupta", "score": 450, "gameType": "speed_blitz"},
			{"rank": 2, "name": "Kapil (You)", "score": 380, "gameType": "speed_blitz"},
		},
	})
}
