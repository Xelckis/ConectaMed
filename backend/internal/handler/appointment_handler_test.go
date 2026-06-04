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

func setupAppointmentRouterFull(appHandler *handler.AppointmentHandler) *gin.Engine {
	gin.SetMode(gin.TestMode)
	router := gin.Default()
	router.Use(func(c *gin.Context) {
		c.Set("userID", "usuario-123")
		c.Next()
	})

	router.POST("/appointments", appHandler.Create)
	router.PUT("/appointments/:id", appHandler.Update)
	router.DELETE("/appointments/:id", appHandler.Delete)
	return router
}

func TestAppointmentHandler_Create_InvalidData(t *testing.T) {
	appHandler := handler.NewAppointmentHandler(nil)
	router := setupAppointmentRouterFull(appHandler)

	jsonBody, _ := json.Marshal(map[string]string{"specialty": "Geral"})
	req, _ := http.NewRequest(http.MethodPost, "/appointments", bytes.NewBuffer(jsonBody))
	req.Header.Set("Content-Type", "application/json")

	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusBadRequest, w.Code)
}

func TestAppointmentHandler_Update_Forbidden(t *testing.T) {
	appHandler := handler.NewAppointmentHandler(nil)
	router := setupAppointmentRouterFull(appHandler)

	// Pedido sem a data de início (StartTime) que é obrigatória
	jsonBody, _ := json.Marshal(map[string]string{"title": "Teste Erro"})
	req, _ := http.NewRequest(http.MethodPut, "/appointments/1", bytes.NewBuffer(jsonBody))
	req.Header.Set("Content-Type", "application/json")

	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusBadRequest, w.Code)
}
