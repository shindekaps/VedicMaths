package auth

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

// Handler interface defines the API contract for authentication operations
type Handler interface {
	Register(c *gin.Context)
	Login(c *gin.Context)
}

type handler struct {
	service Service
}

// NewHandler initializes a new authentication handler with the provided service
func NewHandler(service Service) Handler {
	return &handler{service: service}
}

// Register handles the user registration POST request
func (h *handler) Register(c *gin.Context) {
	var req struct {
		Email    string `json:"email" binding:"required,email"`
		Password string `json:"password" binding:"required,min=6"`
		Username string `json:"username" binding:"required"`
		Grade    int    `json:"grade" binding:"required"`
	}

	// Validate JSON request body
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Invoke the service layer to register the user
	err := h.service.Register(c.Request.Context(), req.Email, req.Password, req.Username, req.Grade)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to register user"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"message": "User registered successfully"})
}

// Login handles the user login POST request
func (h *handler) Login(c *gin.Context) {
	var req struct {
		Email    string `json:"email" binding:"required,email"`
		Password string `json:"password" binding:"required"`
	}

	// Validate JSON request body
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Invoke service to verify credentials and get token
	token, err := h.service.Login(c.Request.Context(), req.Email, req.Password)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid credentials"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"token": token})
}
