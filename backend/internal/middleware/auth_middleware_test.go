package middleware_test

import (
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"os"
	"testing"
	"time"

	"conectamed/internal/middleware"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
	"github.com/stretchr/testify/assert"
)

func setupRouter() *gin.Engine {
	gin.SetMode(gin.TestMode)
	router := gin.Default()

	router.GET("/rota-protegida", middleware.AuthMiddleware(), func(c *gin.Context) {
		userID, _ := c.Get("userID")
		c.JSON(http.StatusOK, gin.H{"userID": userID})
	})

	return router
}

func createTestToken(userID string, secret string, duration time.Duration) string {
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"sub": userID,
		"exp": time.Now().Add(duration).Unix(),
	})
	tokenString, _ := token.SignedString([]byte(secret))
	return tokenString
}

func TestAuthMiddleware_Success(t *testing.T) {
	os.Setenv("JWT_SECRET", "segredo_de_teste")
	defer os.Unsetenv("JWT_SECRET")

	validToken := createTestToken("id-usuario-123", "segredo_de_teste", time.Hour)

	router := setupRouter()
	req, _ := http.NewRequest(http.MethodGet, "/rota-protegida", nil)
	req.Header.Set("Authorization", "Bearer "+validToken)
	w := httptest.NewRecorder()

	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusOK, w.Code)

	var response map[string]string
	json.Unmarshal(w.Body.Bytes(), &response)
	assert.Equal(t, "id-usuario-123", response["userID"])
}

func TestAuthMiddleware_MissingToken(t *testing.T) {
	router := setupRouter()

	req, _ := http.NewRequest(http.MethodGet, "/rota-protegida", nil)
	w := httptest.NewRecorder()

	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusUnauthorized, w.Code)
	assert.Contains(t, w.Body.String(), "Token de acesso não fornecido")
}

func TestAuthMiddleware_InvalidFormat(t *testing.T) {
	router := setupRouter()

	req, _ := http.NewRequest(http.MethodGet, "/rota-protegida", nil)
	req.Header.Set("Authorization", "token-solto-aqui")
	w := httptest.NewRecorder()

	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusUnauthorized, w.Code)
	assert.Contains(t, w.Body.String(), "Formato de token inválido")
}

func TestAuthMiddleware_InvalidSignature(t *testing.T) {
	os.Setenv("JWT_SECRET", "segredo_oficial")
	defer os.Unsetenv("JWT_SECRET")

	fakeToken := createTestToken("id-123", "senha_falsa", time.Hour)

	router := setupRouter()
	req, _ := http.NewRequest(http.MethodGet, "/rota-protegida", nil)
	req.Header.Set("Authorization", "Bearer "+fakeToken)
	w := httptest.NewRecorder()

	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusUnauthorized, w.Code)
	assert.Contains(t, w.Body.String(), "Token inválido ou expirado")
}
