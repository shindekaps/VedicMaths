package practice

import (
	"context"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

// Service defines the interface for practice session business logic
// This must match the Service interface defined in service.go
type Service interface {
	StartSession(ctx context.Context, userID, sutraID uuid.UUID) (uuid.UUID, error)
}

// Handler interface defines the API contract for practice operations
type Handler interface {
	StartSession(c *gin.Context)
}

type handler struct {
	service Service
}

// NewHandler initializes a new practice handler
func NewHandler(service Service) Handler {
	return &handler{service: service}
}

// StartSession handles the POST request to start a new practice session
func (h *handler) StartSession(c *gin.Context) {
	// In a real app, get UserID from JWT middleware
	userID := uuid.New()
	
	sutraIDStr := c.Param("sutraID")
	sutraID, err := uuid.Parse(sutraIDStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid Sutra ID"})
		return
	}

	// Use c.Request.Context() for context propagation
	sessionID, err := h.service.StartSession(c.Request.Context(), userID, sutraID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to start session"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"sessionID": sessionID})
}
