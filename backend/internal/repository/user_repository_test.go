package repository_test

import (
	"context"
	"testing"

	"conectamed/internal/models"
	"conectamed/internal/repository"

	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/stretchr/testify/assert"
)

func TestUserRepository_Create(t *testing.T) {
	dbURL := "postgresql://conectamed_db:conectamed_db@localhost:5432/conectamed?sslmode=disable"
	if dbURL == "" {
		t.Skip("Pulando teste de integração: TEST_DATABASE_URL não configurada")
	}

	ctx := context.Background()
	pool, err := pgxpool.New(ctx, dbURL)
	assert.NoError(t, err)
	defer pool.Close()

	repo := repository.NewUserRepository(pool)

	user := &models.User{
		Name:         "Teste Integração",
		Email:        "teste.integracao@email.com",
		PasswordHash: "hash_falso",
	}

	err = repo.Create(ctx, user)
	assert.NoError(t, err)
	assert.NotEmpty(t, user.ID)

	errDuplicado := repo.Create(ctx, user)
	assert.Error(t, errDuplicado)

	_, _ = pool.Exec(ctx, "DELETE FROM users WHERE email = $1", user.Email)
}

func TestUserRepository_FindByEmail(t *testing.T) {
	dbURL := "postgresql://conectamed_db:conectamed_db@localhost:5432/conectamed?sslmode=disable"
	if dbURL == "" {
		t.Skip("Pulando teste de integração: TEST_DATABASE_URL não configurada")
	}

	ctx := context.Background()
	pool, _ := pgxpool.New(ctx, dbURL)
	defer pool.Close()

	repo := repository.NewUserRepository(pool)

	email := "busca@email.com"
	user := &models.User{
		Name:         "Teste Busca",
		Email:        email,
		PasswordHash: "hash_aleatorio",
	}
	_ = repo.Create(ctx, user)

	defer func() {
		_, _ = pool.Exec(ctx, "DELETE FROM users WHERE email = $1", email)
	}()

	// 2. Testa a busca com sucesso
	foundUser, err := repo.FindByEmail(ctx, email)
	assert.NoError(t, err)
	assert.NotNil(t, foundUser)
	assert.Equal(t, email, foundUser.Email)
	assert.Equal(t, user.ID, foundUser.ID)

	notFoundUser, err := repo.FindByEmail(ctx, "naoexiste@email.com")
	assert.ErrorIs(t, err, pgx.ErrNoRows)
	assert.Nil(t, notFoundUser)
}
