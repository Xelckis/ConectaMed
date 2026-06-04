package repository_test

import (
	"context"
	"testing"

	"conectamed/internal/models"
	"conectamed/internal/repository"

	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/stretchr/testify/assert"
)

func TestPatientRepository_Integration(t *testing.T) {
	dbURL := "postgresql://conectamed_db:conectamed_db@localhost:5432/conectamed?sslmode=disable"
	if dbURL == "" {
		t.Skip("Pulando teste de integração: TEST_DATABASE_URL não configurada")
	}

	ctx := context.Background()
	pool, err := pgxpool.New(ctx, dbURL)
	assert.NoError(t, err)
	defer pool.Close()

	userRepo := repository.NewUserRepository(pool)
	patientRepo := repository.NewPatientRepository(pool)

	user := &models.User{
		Name:         "Admin Teste",
		Email:        "admin.paciente@teste.com",
		PasswordHash: "hash123",
	}
	err = userRepo.Create(ctx, user)
	assert.NoError(t, err)

	defer func() {
		_, _ = pool.Exec(ctx, "DELETE FROM users WHERE id = $1", user.ID)
	}()

	patient := &models.Patient{
		Name:        "Paciente Integração",
		DateOfBirth: "1940-10-10",
	}
	err = patientRepo.Create(ctx, patient, user.ID)

	assert.NoError(t, err)
	assert.NotEmpty(t, patient.ID) // Garante que o Postgres retornou um ID UUID gerado

	patients, err := patientRepo.FindAllByUserID(ctx, user.ID)

	assert.NoError(t, err)
	assert.Len(t, patients, 1) // Deve ter exatamente 1 paciente
	assert.Equal(t, "Paciente Integração", patients[0].Name)
}
