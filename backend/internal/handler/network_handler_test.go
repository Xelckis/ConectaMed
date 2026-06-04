package handler_test

import (
	"bytes"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"

	"conectamed/internal/handler"
	"conectamed/internal/models"

	"github.com/gin-gonic/gin"
	"github.com/stretchr/testify/assert"
)

func setupNetworkRouter(networkHandler *handler.NetworkHandler) *gin.Engine {
	gin.SetMode(gin.TestMode)
	router := gin.Default()
	router.Use(func(c *gin.Context) {
		c.Set("userID", "requerente-123")
		c.Next()
	})
	router.POST("/patients/:patient_id/network", networkHandler.Add)
	return router
}

func TestNetworkHandler_Add_InvalidRole(t *testing.T) {
	netHandler := handler.NewNetworkHandler(nil) // Serviço nulo, vai falhar na validação do Gin
	router := setupNetworkRouter(netHandler)

	reqBody := models.AddNetworkMemberRequest{
		Email: "teste@teste.com",
		Role:  "MEDICO",
	}
	jsonBody, _ := json.Marshal(reqBody)

	req, _ := http.NewRequest(http.MethodPost, "/patients/1/network", bytes.NewBuffer(jsonBody))
	req.Header.Set("Content-Type", "application/json")

	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusBadRequest, w.Code)
	assert.Contains(t, w.Body.String(), "Dados inválidos")
}

func TestNetworkHandler_Add_InvalidEmail(t *testing.T) {
	netHandler := handler.NewNetworkHandler(nil)
	router := setupNetworkRouter(netHandler)

	reqBody := map[string]string{"email": "isto-nao-e-um-email", "role": "MEMBRO"}
	jsonBody, _ := json.Marshal(reqBody)

	req, _ := http.NewRequest(http.MethodPost, "/patients/1/network", bytes.NewBuffer(jsonBody))
	req.Header.Set("Content-Type", "application/json")

	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusBadRequest, w.Code)
}
