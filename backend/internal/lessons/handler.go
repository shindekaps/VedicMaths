package lessons

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
)

// Handler interface defines the API contract for learning operations
type Handler interface {
	ListSutras(c *gin.Context)
	GetLessons(c *gin.Context)
	GetSutraWithLessons(c *gin.Context)
	GetLessonDetails(c *gin.Context)
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

func (h *handler) GetSutraWithLessons(c *gin.Context) {
	sutraId := c.Param("sutraId")
	sutra, err := h.service.GetSutraWithLessons(c.Request.Context(), sutraId)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"success": false, "error": "Sutra not found"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"success": true, "data": sutra})
}

func (h *handler) GetLessonDetails(c *gin.Context) {
	sutraId := c.Param("sutraId")
	lessonNumStr := c.Param("lessonNumber")
	
	lessonNum, err := strconv.Atoi(lessonNumStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "error": "Invalid lesson number"})
		return
	}

	lesson, err := h.service.GetLessonDetails(c.Request.Context(), sutraId, lessonNum)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"success": false, "error": "Lesson not found"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"success": true, "data": gin.H{"lesson": lesson}})
}
