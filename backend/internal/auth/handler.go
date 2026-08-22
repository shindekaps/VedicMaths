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
		Name     string `json:"name" binding:"required"`
		Email    string `json:"email" binding:"required,email"`
		Password string `json:"password" binding:"required,min=6"`
	}

	// Validate JSON request body
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "error": err.Error()})
		return
	}

	// Invoke the service layer to register the user
	err := h.service.Register(c.Request.Context(), req.Email, req.Password, req.Name, 6)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "error": "Failed to register user: " + err.Error()})
		return
	}

	// Auto-login the user after registration
	user, token, err := h.service.Login(c.Request.Context(), req.Email, req.Password)
	if err != nil {
		c.JSON(http.StatusCreated, gin.H{"success": true, "message": "User registered successfully, but failed to auto-login: " + err.Error()})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"success": true,
		"data": gin.H{
			"userId":       user.ID.Hex(),
			"email":        user.Email,
			"firstName":    user.FirstName,
			"lastName":     "",
			"profilePhoto": "https://avatar.vercel.sh/" + user.NickName,
			"accessToken":  token,
			"refreshToken": "ref-mock-token-" + user.ID.Hex(),
		},
	})
}

// Login handles the user login POST request
func (h *handler) Login(c *gin.Context) {
	var req struct {
		Email    string `json:"email" binding:"required,email"`
		Password string `json:"password" binding:"required"`
	}

	// Validate JSON request body
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "error": err.Error()})
		return
	}

	// Invoke service to verify credentials and get token
	user, token, err := h.service.Login(c.Request.Context(), req.Email, req.Password)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"success": false, "error": "Invalid credentials: " + err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data": gin.H{
			"userId":       user.ID.Hex(),
			"email":        user.Email,
			"firstName":    user.FirstName,
			"lastName":     "",
			"profilePhoto": "https://avatar.vercel.sh/" + user.NickName,
			"accessToken":  token,
			"refreshToken": "ref-mock-token-" + user.ID.Hex(),
		},
	})
}
