package handler_test

import (
	"bytes"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"

	"conectamed/internal/handler"

	"github.com/gin-gonic/gin"
	"github.com/stretchr/testify/assert"
)

func setupRouterWithFakeAuth(patientHandler *handler.PatientHandler, userID string) *gin.Engine {
	gin.SetMode(gin.TestMode)
	router := gin.Default()

	router.Use(func(c *gin.Context) {
		if userID != "" {
			c.Set("userID", userID)
		}
		c.Next()
	})

	router.POST("/patients", patientHandler.Create)
	router.GET("/patients", patientHandler.List)
	return router
}

func TestPatientHandler_Create_InvalidData(t *testing.T) {
	patientHandler := handler.NewPatientHandler(nil)
	router := setupRouterWithFakeAuth(patientHandler, "user-123")

	reqBody := map[string]string{"name": "Sem Data"}
	jsonBody, _ := json.Marshal(reqBody)

	req, _ := http.NewRequest(http.MethodPost, "/patients", bytes.NewBuffer(jsonBody))
	req.Header.Set("Content-Type", "application/json")

	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusBadRequest, w.Code)
}

func TestPatientHandler_List_Unauthorized(t *testing.T) {
	patientHandler := handler.NewPatientHandler(nil)
	router := setupRouterWithFakeAuth(patientHandler, "")

	req, _ := http.NewRequest(http.MethodGet, "/patients", nil)
	w := httptest.NewRecorder()

	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusUnauthorized, w.Code)
}
