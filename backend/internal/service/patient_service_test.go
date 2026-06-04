package service_test

import (
	"context"
	"testing"
	"time"

	"conectamed/internal/models"
	"conectamed/internal/service"

	"github.com/stretchr/testify/assert"
)

type MockPatientRepository struct {
	MockCreate          func(ctx context.Context, patient *models.Patient, creatorUserID string) error
	MockFindAllByUserID func(ctx context.Context, userID string) ([]models.Patient, error)
}

func (m *MockPatientRepository) Create(ctx context.Context, patient *models.Patient, creatorUserID string) error {
	return m.MockCreate(ctx, patient, creatorUserID)
}

func (m *MockPatientRepository) FindAllByUserID(ctx context.Context, userID string) ([]models.Patient, error) {
	return m.MockFindAllByUserID(ctx, userID)
}

func TestCreatePatient_Success(t *testing.T) {
	mockRepo := &MockPatientRepository{
		MockCreate: func(ctx context.Context, patient *models.Patient, creatorUserID string) error {
			patient.ID = "paciente-123"
			patient.CreatedAt = time.Now()
			return nil
		},
	}
	svc := service.NewPatientService(mockRepo)

	req := models.CreatePatientRequest{
		Name:        "João da Silva",
		DateOfBirth: "1950-01-01",
	}

	patient, err := svc.CreatePatient(context.Background(), req, "usuario-123")

	assert.NoError(t, err)
	assert.NotNil(t, patient)
	assert.Equal(t, "paciente-123", patient.ID)
	assert.Equal(t, "João da Silva", patient.Name)
}

func TestGetPatientsByUser_Success(t *testing.T) {
	mockRepo := &MockPatientRepository{
		MockFindAllByUserID: func(ctx context.Context, userID string) ([]models.Patient, error) {
			return []models.Patient{
				{ID: "p1", Name: "João", DateOfBirth: "1950-01-01"},
				{ID: "p2", Name: "Maria", DateOfBirth: "1955-05-05"},
			}, nil
		},
	}
	svc := service.NewPatientService(mockRepo)

	patients, err := svc.GetPatientsByUser(context.Background(), "usuario-123")

	assert.NoError(t, err)
	assert.Len(t, patients, 2)
	assert.Equal(t, "João", patients[0].Name)
}
