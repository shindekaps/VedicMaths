package lessons

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

// Handler interface defines the API contract for learning operations
type Handler interface {
	ListSutras(c *gin.Context)
	GetLessons(c *gin.Context)
}

type handler struct {
	service Service
}

// NewHandler initializes a new lessons handler with the provided service
func NewHandler(service Service) Handler {
	return &handler{service: service}
}

// ListSutras handles the GET request to list all sutras
func (h *handler) ListSutras(c *gin.Context) {
	sutras, err := h.service.ListSutras(c.Request.Context())
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch sutras"})
		return
	}
	c.JSON(http.StatusOK, sutras)
}

// GetLessons handles the GET request to list lessons for a specific sutra
func (h *handler) GetLessons(c *gin.Context) {
	sutraID := c.Param("sutraID")
	lessons, err := h.service.GetLessons(c.Request.Context(), sutraID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch lessons"})
		return
	}
	c.JSON(http.StatusOK, lessons)
}
