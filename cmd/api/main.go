package main

import (
	"context"
	"log"
	"net/http"
	"os"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/joho/godotenv"

	"conectamed/internal/handler"
	"conectamed/internal/middleware"
	"conectamed/internal/repository"
	"conectamed/internal/service"
)

func main() {
	if err := godotenv.Load(); err != nil {
		log.Println("Aviso: Arquivo .env não encontrado. Usando variáveis de ambiente do sistema.")
	}

	dbURL := os.Getenv("DATABASE_URL")
	if dbURL == "" {
		log.Fatal("DATABASE_URL não está configurada")
	}

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	config, err := pgxpool.ParseConfig(dbURL)
	if err != nil {
		log.Fatalf("Erro ao analisar a URL do banco: %v", err)
	}

	pool, err := pgxpool.NewWithConfig(ctx, config)
	if err != nil {
		log.Fatalf("Erro ao conectar no banco de dados: %v", err)
	}
	defer pool.Close()

	if err := pool.Ping(ctx); err != nil {
		log.Fatalf("Banco de dados indisponível: %v", err)
	}
	log.Println("✅ Conectado ao PostgreSQL com pgxpool com sucesso!")

	router := gin.Default()

	router.GET("/ping", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"message": "pong! ConectaMed API está online.",
		})
	})

	userRepo := repository.NewUserRepository(pool)
	userService := service.NewUserService(userRepo)
	userHandler := handler.NewUserHandler(userService)

	publicRoutes := router.Group("/api/v1")
	{
		publicRoutes.POST("/users/register", userHandler.Register)
		publicRoutes.POST("/users/login", userHandler.Login)
	}

	protectedRoutes := router.Group("/api/v1")
	protectedRoutes.Use(middleware.AuthMiddleware())
	{
		protectedRoutes.GET("/perfil", func(c *gin.Context) {
			userID := c.MustGet("userID").(string)

			c.JSON(http.StatusOK, gin.H{
				"message":                  "Acesso autorizado!",
				"seu_id_no_banco_de_dados": userID,
			})
		})
	}

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	log.Printf("🚀 Servidor rodando na porta %s", port)
	if err := router.Run(":" + port); err != nil {
		log.Fatalf("Erro ao iniciar o servidor: %v", err)
	}
}
