package domain

import (
    "time"
    "github.com/google/uuid"
)

type UserRole string

const (
    RoleStudent UserRole = "student"
    RoleTeacher UserRole = "teacher"
    RoleAdmin   UserRole = "admin"
)

type User struct {
    ID           uuid.UUID `bson:"_id"`
    Email        string    `bson:"email"`
    PasswordHash string    `bson:"password_hash"`
    Username     string    `bson:"username"`
    Role         UserRole  `bson:"role"`
    Grade        int       `bson:"grade"`
    AvatarURL    string    `bson:"avatar_url"`
    CreatedAt    time.Time `bson:"created_at"`
}
