package domain

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type UserPreferences struct {
	DailyGoal     int    `bson:"dailyGoal" json:"dailyGoal"`
	Notifications bool   `bson:"notifications" json:"notifications"`
	DarkMode      bool   `bson:"darkMode" json:"darkMode"`
	Language      string `bson:"language" json:"language"`
}

type User struct {
	ID           primitive.ObjectID `bson:"_id,omitempty" json:"id"`
	GoogleID     string             `bson:"googleId,omitempty" json:"googleId"`
	Email        string             `bson:"email" json:"email"`
	FirstName    string             `bson:"firstName" json:"firstName"`
	LastName     string             `bson:"lastName" json:"lastName"`
	NickName     string             `bson:"nickName" json:"nickName"`
	ProfilePhoto string             `bson:"profilePhoto" json:"profilePhoto"`
	Password     string             `bson:"password" json:"password"`
	CreatedAt    time.Time          `bson:"createdAt" json:"createdAt"`
	UpdatedAt    time.Time          `bson:"updatedAt" json:"updatedAt"`
	LastLogin    time.Time          `bson:"lastLogin" json:"lastLogin"`
	IsActive     bool               `bson:"isActive" json:"isActive"`
	Preferences  UserPreferences    `bson:"preferences" json:"preferences"`
}
