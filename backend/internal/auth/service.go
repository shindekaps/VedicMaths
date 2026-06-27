package auth

import (
	"context"
	"errors"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"github.com/yourorg/vedicpath/internal/domain"
	"golang.org/x/crypto/bcrypt"
)

// Service defines the interface for authentication operations
type Service interface {
	Register(ctx context.Context, email, password, username string, grade int) error
	Login(ctx context.Context, email, password string) (string, error)
}

type service struct {
	repo       Repository
	jwtSecret  []byte
}

// NewService initializes a new authentication service
func NewService(repo Repository, jwtSecret string) Service {
	return &service{
		repo:      repo,
		jwtSecret: []byte(jwtSecret),
	}
}

// Register hashes the password and saves a new user
func (s *service) Register(ctx context.Context, email, password, username string, grade int) error {
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		return err
	}

	user := &domain.User{
		Email:        email,
		PasswordHash: string(hashedPassword),
		Username:     username,
		Role:         domain.RoleStudent,
		Grade:        grade,
		CreatedAt:    time.Now(),
	}

	return s.repo.Create(ctx, user)
}

// Login verifies credentials and generates a JWT
func (s *service) Login(ctx context.Context, email, password string) (string, error) {
	user, err := s.repo.GetByEmail(ctx, email)
	if err != nil {
		return "", errors.New("invalid credentials")
	}

	// Compare provided password with hashed password
	err = bcrypt.CompareHashAndPassword([]byte(user.PasswordHash), []byte(password))
	if err != nil {
		return "", errors.New("invalid credentials")
	}

	// Create JWT token
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"user_id": user.ID,
		"exp":     time.Now().Add(time.Hour * 24).Unix(),
	})

	return token.SignedString(s.jwtSecret)
}
