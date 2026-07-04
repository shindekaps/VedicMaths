package domain

import (
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type Sutra struct {
	ID             int    `bson:"_id" json:"id"`
	Slug           string `bson:"slug" json:"slug"`
	SanskritName   string `bson:"sanskritName" json:"name"`
	EnglishMeaning string `bson:"englishMeaning" json:"meaning"`
	OrderIndex     int    `bson:"orderIndex" json:"order_index"`
}

type SutraDTO struct {
	ID          string  `json:"id"`
	Name        string  `json:"name"`
	Slug        string  `json:"slug"`
	Meaning     string  `json:"meaning"`
	Description string  `json:"description"`
	OrderIndex  int     `json:"order_index"`
}

type Lesson struct {
	ID         primitive.ObjectID `bson:"_id" json:"id"`
	SutraID    int32              `bson:"sutra_id" json:"sutra_id"`
	Title      string             `bson:"title" json:"title"`
	Steps      interface{}        `bson:"steps" json:"steps"`
	OrderIndex int                `bson:"order_index" json:"order_index"`
}

type LessonStep struct {
	Type string      `bson:"type" json:"type"`
	Data interface{} `bson:"data" json:"data"`
}

type Intro struct {
	Description  string   `bson:"description" json:"description"`
	WhatYouLearn []string `bson:"whatYouLearn" json:"whatYouLearn"`
}

type Concept struct {
	Title       string `bson:"title" json:"title"`
	Formula     string `bson:"formula" json:"formula"`
	FormulaNote string `bson:"formulaNote" json:"formulaNote"`
	Rules       []Rule `bson:"rules" json:"rules"`
}

type Rule struct {
	Icon string `bson:"icon" json:"icon"`
	Text string `bson:"text" json:"text"`
}

type VisualExample struct {
	Problem         string `bson:"problem" json:"problem"`
	DisplayEquation string `bson:"displayEquation" json:"displayEquation"`
	Steps           []Step `bson:"steps" json:"steps"`
}

type Step struct {
	Num      interface{} `bson:"num" json:"num"` // Supports int or string for checkmark
	Title    string      `bson:"title" json:"title"`
	Calc     string      `bson:"calc" json:"calc"`
	IsAnswer bool        `bson:"isAnswer,omitempty" json:"isAnswer,omitempty"`
}
