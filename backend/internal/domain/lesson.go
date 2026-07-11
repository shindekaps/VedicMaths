package domain

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type Sutra struct {
	ID             primitive.ObjectID   `bson:"_id" json:"id"`
	SutraId        int                  `bson:"sutraId" json:"sutraId"`
	Name           string               `bson:"name" json:"name"`
	SanskritName   string               `bson:"sanskritName" json:"sanskritName"`
	Description    string               `bson:"description" json:"description"`
	Order          int                  `bson:"order" json:"order"`
	Difficulty     string               `bson:"difficulty" json:"difficulty"`
	Prerequisites  []primitive.ObjectID `bson:"prerequisites" json:"prerequisites"`
	EstimatedHours float64              `bson:"estimatedHours" json:"estimatedHours"`
	Icon           string               `bson:"icon" json:"icon"`
	Color          string               `bson:"color" json:"color"`
	CreatedAt      time.Time            `bson:"createdAt" json:"createdAt"`
	UpdatedAt      time.Time            `bson:"updatedAt" json:"updatedAt"`
}

type SutraDTO struct {
	ID         string `json:"id"`
	Name       string `json:"name"`
	Slug       string `json:"slug"`
	Meaning    string `json:"meaning"`
	OrderIndex int    `json:"order_index"`
}

type Example struct {
	Problem     string   `bson:"problem" json:"problem"`
	Solution    string   `bson:"solution" json:"solution"`
	Steps       []string `bson:"steps" json:"steps"`
	Explanation string   `bson:"explanation" json:"explanation"`
}

type Lesson struct {
	ID               primitive.ObjectID `bson:"_id" json:"id"`
	LessonId         string             `bson:"lessonId" json:"lessonId"`
	SutraId          primitive.ObjectID `bson:"sutraId" json:"sutraId"`
	SutraNumber      int                `bson:"sutraNumber" json:"sutraNumber"`
	LessonNumber     int                `bson:"lessonNumber" json:"lessonNumber"`
	Title            string             `bson:"title" json:"title"`
	Description      string             `bson:"description" json:"description"`
	Content          string             `bson:"content" json:"content"`
	Examples         []Example          `bson:"examples" json:"examples"`
	Difficulty       string             `bson:"difficulty" json:"difficulty"`
	EstimatedMinutes int                `bson:"estimatedMinutes" json:"estimatedMinutes"`
	VideoUrl         string             `bson:"videoUrl" json:"videoUrl"`
	Order            int                `bson:"order" json:"order"`
	IsActive         bool               `bson:"isActive" json:"isActive"`
	CreatedAt        time.Time          `bson:"createdAt" json:"createdAt"`
	UpdatedAt        time.Time          `bson:"updatedAt" json:"updatedAt"`
}
