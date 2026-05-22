package handler_test

import (
	"bytes"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"

	"conectamed/internal/handler"
	"conectamed/internal/models"
	"conectamed/internal/service"

	"github.com/gin-gonic/gin"
	"github.com/stretchr/testify/assert"
)

func TestRegisterHandler_InvalidData(t *testing.T) {
	gin.SetMode(gin.TestMode)

	userHandler := handler.NewUserHandler(&service.UserService{})
	router := gin.Default()
	router.POST("/register", userHandler.Register)

	reqBody := models.CreateUserRequest{
		Name:     "Maria",
		Email:    "email-invalido",
		Password: "123",
	}
	jsonBody, _ := json.Marshal(reqBody)

	req, _ := http.NewRequest(http.MethodPost, "/register", bytes.NewBuffer(jsonBody))
	req.Header.Set("Content-Type", "application/json")

	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusBadRequest, w.Code)
}

func TestLoginHandler_InvalidData(t *testing.T) {
	gin.SetMode(gin.TestMode)

	userHandler := handler.NewUserHandler(&service.UserService{})
	router := gin.Default()
	router.POST("/login", userHandler.Login)

	reqBody := map[string]string{"email": "teste@teste.com"}
	jsonBody, _ := json.Marshal(reqBody)

	req, _ := http.NewRequest(http.MethodPost, "/login", bytes.NewBuffer(jsonBody))
	req.Header.Set("Content-Type", "application/json")

	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusBadRequest, w.Code)
}
