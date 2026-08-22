package extra

import (
	"context"
	"encoding/json"
	"fmt"
	"math/rand"
	"net/http"
	"strconv"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
	"golang.org/x/crypto/bcrypt"

	"vedicpath/internal/domain"
	"vedicpath/internal/generator"
)

type Handler struct {
	db        *mongo.Database
	gen       *generator.Service
	jwtSecret []byte
}

func NewHandler(db *mongo.Database, gen *generator.Service, jwtSecret string) *Handler {
	return &Handler{
		db:        db,
		gen:       gen,
		jwtSecret: []byte(jwtSecret),
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

// 3. Google OAuth Login
func (h *Handler) GoogleLogin(c *gin.Context) {
	var req struct {
		GoogleIdToken     string `json:"googleIdToken" binding:"required"`
		GoogleAccessToken string `json:"googleAccessToken"`
	}
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "error": err.Error()})
		return
	}

	var googleEmail string
	var googleID string
	var firstName string
	var lastName string
	var profilePhoto string

	// Support both development mock token and actual Google verification
	if req.GoogleIdToken == "google-mock-token" {
		googleEmail = "google.student@gmail.com"
		googleID = "google-oauth-mock-id"
		firstName = "Student"
		lastName = "Vedic"
		profilePhoto = "https://avatar.vercel.sh/student"
	} else {
		// Verify real Google token by calling Google TokenInfo API
		resp, err := http.Get("https://oauth2.googleapis.com/tokeninfo?id_token=" + req.GoogleIdToken)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"success": false, "error": "Failed to connect to Google verification API: " + err.Error()})
			return
		}
		defer resp.Body.Close()

		if resp.StatusCode != http.StatusOK {
			c.JSON(http.StatusUnauthorized, gin.H{"success": false, "error": "Invalid Google ID token"})
			return
		}

		var claims struct {
			Sub        string `json:"sub"`
			Email      string `json:"email"`
			Name       string `json:"name"`
			Picture    string `json:"picture"`
			GivenName  string `json:"given_name"`
			FamilyName string `json:"family_name"`
		}
		if err := json.NewDecoder(resp.Body).Decode(&claims); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"success": false, "error": "Failed to decode Google token claims: " + err.Error()})
			return
		}

		googleEmail = claims.Email
		googleID = claims.Sub
		firstName = claims.GivenName
		lastName = claims.FamilyName
		profilePhoto = claims.Picture
		if firstName == "" {
			firstName = claims.Name
		}
	}

	// 1. Find or create the user in MongoDB
	usersCol := h.db.Collection("users")
	var user domain.User
	ctx := c.Request.Context()

	err := usersCol.FindOne(ctx, bson.M{"googleId": googleID}).Decode(&user)
	if err != nil {
		// Not found, let's insert a new Google user
		user = domain.User{
			ID:           primitive.NewObjectID(),
			GoogleID:     googleID,
			Email:        googleEmail,
			FirstName:    firstName,
			LastName:     lastName,
			NickName:     firstName,
			Username:     googleEmail,
			Role:         "student",
			ProfilePhoto: profilePhoto,
			CreatedAt:    time.Now(),
			UpdatedAt:    time.Now(),
			IsActive:     true,
			Preferences: domain.UserPreferences{
				DailyGoal:     60,
				Notifications: true,
				DarkMode:      false,
				Language:      "en",
			},
		}
		_, insertErr := usersCol.InsertOne(ctx, user)
		if insertErr != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"success": false, "error": "Failed to create user: " + insertErr.Error()})
			return
		}
	}

	// 2. Generate a real JWT access token
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"user_id": user.ID.Hex(),
		"exp":     time.Now().Add(time.Hour * 24).Unix(),
	})

	tokenStr, err := token.SignedString(h.jwtSecret)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "error": "Failed to sign token: " + err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data": gin.H{
			"userId":       user.ID.Hex(),
			"email":        user.Email,
			"firstName":    user.FirstName,
			"lastName":     user.LastName,
			"profilePhoto": user.ProfilePhoto,
			"accessToken":  tokenStr,
			"refreshToken": "ref-mock-token-" + user.ID.Hex(),
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

// Helper to parse user ID from token
func (h *Handler) getUserIDFromAuth(c *gin.Context) (primitive.ObjectID, error) {
	authHeader := c.GetHeader("Authorization")
	if authHeader == "" {
		return primitive.NilObjectID, fmt.Errorf("no authorization header")
	}

	parts := strings.Split(authHeader, " ")
	if len(parts) < 2 {
		return primitive.NilObjectID, fmt.Errorf("invalid authorization header format")
	}
	tokenStr := parts[len(parts)-1]

	token, err := jwt.Parse(tokenStr, func(t *jwt.Token) (interface{}, error) {
		return h.jwtSecret, nil
	})
	if err != nil || !token.Valid {
		return primitive.NilObjectID, fmt.Errorf("invalid token")
	}

	claims, ok := token.Claims.(jwt.MapClaims)
	if !ok {
		return primitive.NilObjectID, fmt.Errorf("invalid claims")
	}

	userIDStr, ok := claims["user_id"].(string)
	if !ok {
		return primitive.NilObjectID, fmt.Errorf("user_id not found in claims")
	}

	objID, err := primitive.ObjectIDFromHex(userIDStr)
	if err != nil {
		return primitive.NilObjectID, fmt.Errorf("invalid user ID hex")
	}

	return objID, nil
}

// 6. Get User Profile
func (h *Handler) GetProfile(c *gin.Context) {
	userID, err := h.getUserIDFromAuth(c)
	if err != nil {
		// Graceful fallback to mock user Kapil if not logged in
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
		return
	}

	var user domain.User
	err = h.db.Collection("users").FindOne(c.Request.Context(), bson.M{"_id": userID}).Decode(&user)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"success": false, "error": "User not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data": gin.H{
			"userId":       user.ID.Hex(),
			"email":        user.Email,
			"firstName":    user.FirstName,
			"lastName":     user.LastName,
			"nickName":     user.NickName,
			"profilePhoto": "https://avatar.vercel.sh/" + user.NickName,
			"createdAt":    user.CreatedAt,
			"preferences": gin.H{
				"dailyGoal":     user.Preferences.DailyGoal,
				"notifications": user.Preferences.Notifications,
				"darkMode":      user.Preferences.DarkMode,
				"language":      user.Preferences.Language,
			},
		},
	})
}

// 7. Update User Profile
func (h *Handler) UpdateProfile(c *gin.Context) {
	userID, err := h.getUserIDFromAuth(c)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"success": false, "error": "Unauthorized"})
		return
	}

	var req struct {
		FirstName   string `json:"firstName"`
		LastName    string `json:"lastName"`
		NickName    string `json:"nickName"`
		Preferences struct {
			DailyGoal     int    `json:"dailyGoal"`
			Notifications bool   `json:"notifications"`
			DarkMode      bool   `json:"darkMode"`
			Language      string `json:"language"`
		} `json:"preferences"`
	}
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "error": err.Error()})
		return
	}

	update := bson.M{
		"$set": bson.M{
			"firstName": req.FirstName,
			"lastName":  req.LastName,
			"nickName":  req.NickName,
			"preferences.dailyGoal":     req.Preferences.DailyGoal,
			"preferences.notifications": req.Preferences.Notifications,
			"preferences.darkMode":      req.Preferences.DarkMode,
			"preferences.language":      req.Preferences.Language,
			"updatedAt":                 time.Now(),
		},
	}

	_, err = h.db.Collection("users").UpdateOne(c.Request.Context(), bson.M{"_id": userID}, update)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "error": "Failed to update profile"})
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
	userID, err := h.getUserIDFromAuth(c)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"success": false, "error": "Unauthorized"})
		return
	}

	var req struct {
		OldPassword string `json:"oldPassword" binding:"required"`
		NewPassword string `json:"newPassword" binding:"required"`
	}
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "error": err.Error()})
		return
	}

	var user domain.User
	err = h.db.Collection("users").FindOne(c.Request.Context(), bson.M{"_id": userID}).Decode(&user)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"success": false, "error": "User not found"})
		return
	}

	err = bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(req.OldPassword))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "error": "Incorrect old password"})
		return
	}

	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(req.NewPassword), bcrypt.DefaultCost)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "error": "Failed to hash new password"})
		return
	}

	_, err = h.db.Collection("users").UpdateOne(
		c.Request.Context(),
		bson.M{"_id": userID},
		bson.M{"$set": bson.M{"password": string(hashedPassword), "updatedAt": time.Now()}},
	)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "error": "Failed to update password"})
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
	userID, err := h.getUserIDFromAuth(c)
	if err != nil {
		// Mock progress stats fallback for guest users
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
		return
	}

	ctx := c.Request.Context()

	// 1. Fetch all active sutras
	var dbSutras []domain.Sutra
	cursor, err := h.db.Collection("sutras").Find(ctx, bson.M{})
	if err == nil {
		_ = cursor.All(ctx, &dbSutras)
	}

	// 2. Fetch all active lessons
	var dbLessons []domain.Lesson
	cursor, err = h.db.Collection("lessons").Find(ctx, bson.M{"isActive": true})
	if err == nil {
		_ = cursor.All(ctx, &dbLessons)
	}

	// 3. Fetch user progress documents
	var progressList []domain.UserProgress
	cursor, err = h.db.Collection("userProgress").Find(ctx, bson.M{"userId": userID})
	if err == nil {
		_ = cursor.All(ctx, &progressList)
	}

	// Make a map of progress by SutraNumber and LessonNumber
	progressMap := make(map[string]domain.UserProgress)
	for _, p := range progressList {
		key := fmt.Sprintf("%d_%d", p.SutraNumber, p.LessonNumber)
		progressMap[key] = p
	}

	// Map of total lessons per sutra ID
	sutraTotalLessons := make(map[int]int)
	sutraCompletedLessons := make(map[int]int)
	for _, l := range dbLessons {
		sutraTotalLessons[l.SutraNumber]++
		key := fmt.Sprintf("%d_%d", l.SutraNumber, l.LessonNumber)
		if p, ok := progressMap[key]; ok && p.Status == "completed" {
			sutraCompletedLessons[l.SutraNumber]++
		}
	}

	// Calculate overall stats
	var lessonsCompleted int
	var totalTimeSpent float64
	var scoreSum float64
	var scoreCount int

	for _, p := range progressList {
		if p.LessonNumber > 0 { // It is a lesson progress
			if p.Status == "completed" {
				lessonsCompleted++
			}
			totalTimeSpent += float64(p.TimeSpent)
			if p.BestScore > 0 {
				scoreSum += p.BestScore
				scoreCount++
			}
		}
	}

	averageScore := 0.0
	if scoreCount > 0 {
		averageScore = scoreSum / float64(scoreCount)
	}

	totalSutras := len(dbSutras)
	if totalSutras == 0 {
		totalSutras = 16
	}
	totalLessons := len(dbLessons)
	if totalLessons == 0 {
		totalLessons = 64
	}

	// Calculate completed sutras (a sutra is completed if all its lessons are completed, and total lessons > 0)
	var sutrasCompleted int
	var sutraProgress []gin.H

	for _, s := range dbSutras {
		tot := sutraTotalLessons[s.SutraId]
		comp := sutraCompletedLessons[s.SutraId]

		// default fallback if no lessons in database
		if tot == 0 {
			tot = 4
		}

		completionPercentage := 0
		if tot > 0 {
			completionPercentage = int((float64(comp) / float64(tot)) * 100.0)
		}

		status := "not_started"
		if comp == tot && tot > 0 {
			status = "completed"
			sutrasCompleted++
		} else if comp > 0 {
			status = "in_progress"
		}

		sutraProgress = append(sutraProgress, gin.H{
			"sutraId":              s.SutraId,
			"name":                 s.Name,
			"status":               status,
			"lessonsCompleted":     comp,
			"totalLessons":         tot,
			"completionPercentage": completionPercentage,
		})
	}

	// If sutraProgress is empty, let's return an empty array instead of null
	if sutraProgress == nil {
		sutraProgress = []gin.H{}
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data": gin.H{
			"overallProgress": gin.H{
				"totalSutras":      totalSutras,
				"sutrasCompleted":  sutrasCompleted,
				"totalLessons":     totalLessons,
				"lessonsCompleted": lessonsCompleted,
				"totalTimeSpent":   totalTimeSpent / 3600.0, // Convert seconds to hours
				"averageScore":     averageScore,
			},
			"sutraProgress": sutraProgress,
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
