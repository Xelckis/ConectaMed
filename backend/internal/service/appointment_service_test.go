package service_test

import (
	"context"
	"testing"
	"time"

	"conectamed/internal/models"
	"conectamed/internal/service"

	"github.com/stretchr/testify/assert"
)

type MockAppointmentRepository struct {
	MockCheckConflict          func(ctx context.Context, patientID string, start, end time.Time) (bool, error)
	MockCheckConflictForUpdate func(ctx context.Context, patientID string, start, end time.Time, excludeAppID string) (bool, error)
	MockCreate                 func(ctx context.Context, app *models.Appointment, permittedUserIDs []string) error
	MockFindByPatient          func(ctx context.Context, patientID string) ([]models.Appointment, error)
	MockFindByID               func(ctx context.Context, id string) (*models.Appointment, error)
	MockHasPermission          func(ctx context.Context, appointmentID, userID string) (bool, error)
	MockUpdate                 func(ctx context.Context, id string, req models.UpdateAppointmentRequest) error
	MockDelete                 func(ctx context.Context, id string) error
}

func (m *MockAppointmentRepository) CheckConflict(ctx context.Context, patientID string, start, end time.Time) (bool, error) {
	return m.MockCheckConflict(ctx, patientID, start, end)
}
func (m *MockAppointmentRepository) CheckConflictForUpdate(ctx context.Context, patientID string, start, end time.Time, excludeAppID string) (bool, error) {
	return m.MockCheckConflictForUpdate(ctx, patientID, start, end, excludeAppID)
}
func (m *MockAppointmentRepository) Create(ctx context.Context, app *models.Appointment, permittedUserIDs []string) error {
	return m.MockCreate(ctx, app, permittedUserIDs)
}
func (m *MockAppointmentRepository) FindByPatient(ctx context.Context, patientID string) ([]models.Appointment, error) {
	return m.MockFindByPatient(ctx, patientID)
}
func (m *MockAppointmentRepository) FindByID(ctx context.Context, id string) (*models.Appointment, error) {
	return m.MockFindByID(ctx, id)
}
func (m *MockAppointmentRepository) HasPermission(ctx context.Context, appointmentID, userID string) (bool, error) {
	return m.MockHasPermission(ctx, appointmentID, userID)
}
func (m *MockAppointmentRepository) Update(ctx context.Context, id string, req models.UpdateAppointmentRequest) error {
	return m.MockUpdate(ctx, id, req)
}
func (m *MockAppointmentRepository) Delete(ctx context.Context, id string) error {
	return m.MockDelete(ctx, id)
}

func TestCreateAppointment_Success(t *testing.T) {
	mockRepo := &MockAppointmentRepository{
		MockCheckConflict: func(ctx context.Context, patientID string, start, end time.Time) (bool, error) {
			return false, nil
		},
		MockCreate: func(ctx context.Context, app *models.Appointment, permittedUserIDs []string) error {
			app.ID = "agendamento-123"
			return nil
		},
	}
	svc := service.NewAppointmentService(mockRepo)

	req := models.CreateAppointmentRequest{
		PatientID: "paciente-123",
		Title:     "Consulta Cardiologista",
		StartTime: time.Now().Add(1 * time.Hour),
		EndTime:   time.Now().Add(2 * time.Hour),
	}

	app, err := svc.CreateAppointment(context.Background(), req, "usuario-123")

	assert.NoError(t, err)
	assert.NotNil(t, app)
	assert.Equal(t, "agendamento-123", app.ID)
}

func TestCreateAppointment_Conflict(t *testing.T) {
	mockRepo := &MockAppointmentRepository{
		MockCheckConflict: func(ctx context.Context, patientID string, start, end time.Time) (bool, error) {
			return true, nil
		},
	}
	svc := service.NewAppointmentService(mockRepo)

	req := models.CreateAppointmentRequest{
		PatientID: "paciente-123",
		Title:     "Fisioterapia",
		StartTime: time.Now().Add(1 * time.Hour),
		EndTime:   time.Now().Add(2 * time.Hour),
	}

	app, err := svc.CreateAppointment(context.Background(), req, "usuario-123")

	assert.Error(t, err)
	assert.Nil(t, app)
	assert.Equal(t, "já existe um compromisso agendado para este horário no perfil do paciente", err.Error())
}

func TestCreateAppointment_InvalidTime(t *testing.T) {
	svc := service.NewAppointmentService(&MockAppointmentRepository{})

	req := models.CreateAppointmentRequest{
		PatientID: "paciente-123",
		StartTime: time.Now().Add(2 * time.Hour),
		EndTime:   time.Now().Add(1 * time.Hour),
	}

	_, err := svc.CreateAppointment(context.Background(), req, "usuario-123")
	assert.Error(t, err)
	assert.Equal(t, "o horário de término deve ser posterior ao horário de início", err.Error())
}

func TestUpdateAppointment_Success(t *testing.T) {
	mockRepo := &MockAppointmentRepository{
		MockHasPermission: func(ctx context.Context, appointmentID, userID string) (bool, error) {
			return true, nil // O utilizador TEM permissão
		},
		MockFindByID: func(ctx context.Context, id string) (*models.Appointment, error) {
			return &models.Appointment{PatientID: "paciente-123"}, nil
		},
		MockCheckConflictForUpdate: func(ctx context.Context, patientID string, start, end time.Time, excludeAppID string) (bool, error) {
			return false, nil // Sem conflitos
		},
		MockUpdate: func(ctx context.Context, id string, req models.UpdateAppointmentRequest) error {
			return nil
		},
	}
	svc := service.NewAppointmentService(mockRepo)

	req := models.UpdateAppointmentRequest{
		Title:     "Consulta Alterada",
		StartTime: time.Now().Add(1 * time.Hour),
		EndTime:   time.Now().Add(2 * time.Hour),
	}

	err := svc.UpdateAppointment(context.Background(), "agendamento-123", req, "usuario-autorizado")
	assert.NoError(t, err)
}

func TestUpdateAppointment_PermissionDenied(t *testing.T) {
	mockRepo := &MockAppointmentRepository{
		MockHasPermission: func(ctx context.Context, appointmentID, userID string) (bool, error) {
			return false, nil // O utilizador NÃO TEM permissão
		},
	}
	svc := service.NewAppointmentService(mockRepo)

	req := models.UpdateAppointmentRequest{Title: "Tentativa Hacker"}
	err := svc.UpdateAppointment(context.Background(), "agendamento-123", req, "usuario-malicioso")

	assert.Error(t, err)
	assert.Equal(t, "você não tem permissão para modificar este evento", err.Error())
}

func TestDeleteAppointment_Success(t *testing.T) {
	mockRepo := &MockAppointmentRepository{
		MockHasPermission: func(ctx context.Context, appointmentID, userID string) (bool, error) {
			return true, nil
		},
		MockDelete: func(ctx context.Context, id string) error {
			return nil
		},
	}
	svc := service.NewAppointmentService(mockRepo)

	err := svc.DeleteAppointment(context.Background(), "agendamento-123", "usuario-autorizado")
	assert.NoError(t, err)
}
