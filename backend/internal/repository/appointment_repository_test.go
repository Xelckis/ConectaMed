package repository_test

import (
	"context"
	"testing"
	"time"

	"conectamed/internal/models"
	"conectamed/internal/repository"

	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/stretchr/testify/assert"
)

func TestAppointmentRepository_ConflictCheck(t *testing.T) {
	dbURL := "postgresql://conectamed_db:conectamed_db@localhost:5432/conectamed?sslmode=disable"
	if dbURL == "" {
		t.Skip("Pulando teste de integração: TEST_DATABASE_URL não configurada")
	}

	ctx := context.Background()
	pool, _ := pgxpool.New(ctx, dbURL)
	defer pool.Close()

	userRepo := repository.NewUserRepository(pool)
	patientRepo := repository.NewPatientRepository(pool)
	appRepo := repository.NewAppointmentRepository(pool)

	user := &models.User{Name: "Médico", Email: "medico_conflito@teste.com", PasswordHash: "123"}
	err := userRepo.Create(ctx, user) // <-- Substitua o _ por err
	assert.NoError(t, err)            // <-- Adicione isto
	defer pool.Exec(ctx, "DELETE FROM users WHERE id = $1", user.ID)

	patient := &models.Patient{Name: "Paciente X", DateOfBirth: "2000-01-01"}
	err = patientRepo.Create(ctx, patient, user.ID) // <-- Substitua o _ por err
	assert.NoError(t, err)

	baseTime := time.Date(2026, 6, 3, 14, 0, 0, 0, time.UTC)
	app1 := &models.Appointment{
		PatientID:       patient.ID,
		CreatedByUserID: user.ID,
		Title:           "Consulta A",
		StartTime:       baseTime,                    // 14:00
		EndTime:         baseTime.Add(1 * time.Hour), // 15:00
	}
	err = appRepo.Create(ctx, app1, nil)
	assert.NoError(t, err)

	conflict, err := appRepo.CheckConflict(ctx, patient.ID, baseTime.Add(30*time.Minute), baseTime.Add(90*time.Minute))
	assert.NoError(t, err)
	assert.True(t, conflict, "Deveria detectar conflito, pois os horários se sobrepõem")

	conflictFree, err := appRepo.CheckConflict(ctx, patient.ID, baseTime.Add(1*time.Hour), baseTime.Add(2*time.Hour))
	assert.NoError(t, err)
	assert.False(t, conflictFree, "Não deveria detectar conflito, pois é logo após o término")
}

func TestAppointmentRepository_Permissions(t *testing.T) {
	dbURL := "postgresql://conectamed_db:conectamed_db@localhost:5432/conectamed?sslmode=disable"
	if dbURL == "" {
		t.Skip("A saltar teste de integração: TEST_DATABASE_URL não configurada")
	}

	ctx := context.Background()
	pool, _ := pgxpool.New(ctx, dbURL)
	defer pool.Close()

	userRepo := repository.NewUserRepository(pool)
	patientRepo := repository.NewPatientRepository(pool)
	appRepo := repository.NewAppointmentRepository(pool)

	creator := &models.User{Name: "Criador", Email: "criador_perm@teste.com", PasswordHash: "123"}
	intruder := &models.User{Name: "Intruso", Email: "intruso_perm@teste.com", PasswordHash: "123"}

	err := userRepo.Create(ctx, creator)
	assert.NoError(t, err)

	err = userRepo.Create(ctx, intruder)
	assert.NoError(t, err)

	defer pool.Exec(ctx, "DELETE FROM users WHERE id IN ($1, $2)", creator.ID, intruder.ID)

	patient := &models.Patient{Name: "Paciente Teste Permissoes", DateOfBirth: "2000-01-01"}
	err = patientRepo.Create(ctx, patient, creator.ID)
	assert.NoError(t, err)

	app := &models.Appointment{
		PatientID:       patient.ID,
		CreatedByUserID: creator.ID,
		Title:           "Consulta Confidencial",
		StartTime:       time.Now().Add(24 * time.Hour),
		EndTime:         time.Now().Add(25 * time.Hour),
	}
	err = appRepo.Create(ctx, app, []string{})
	assert.NoError(t, err)

	hasPermCreator, err := appRepo.HasPermission(ctx, app.ID, creator.ID)
	assert.NoError(t, err)
	assert.True(t, hasPermCreator, "O criador deveria ter permissão de edição")

	hasPermIntruder, err := appRepo.HasPermission(ctx, app.ID, intruder.ID)
	assert.NoError(t, err)
	assert.False(t, hasPermIntruder, "Um utilizador não associado não deve ter permissão")
}
