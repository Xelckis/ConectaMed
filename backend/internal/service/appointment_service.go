package service

import (
	"context"
	"errors"
	"time"

	"conectamed/internal/models"
)

type AppointmentRepository interface {
	CheckConflict(ctx context.Context, patientID string, start, end time.Time) (bool, error)
	CheckConflictForUpdate(ctx context.Context, patientID string, start, end time.Time, excludeAppID string) (bool, error)
	Create(ctx context.Context, app *models.Appointment, permittedUserIDs []string) error
	FindByPatient(ctx context.Context, patientID string) ([]models.Appointment, error)
	FindByID(ctx context.Context, id string) (*models.Appointment, error)
	HasPermission(ctx context.Context, appointmentID, userID string) (bool, error)
	Update(ctx context.Context, id string, req models.UpdateAppointmentRequest) error
	Delete(ctx context.Context, id string) error
}

type AppointmentService struct {
	repo AppointmentRepository
}

func NewAppointmentService(repo AppointmentRepository) *AppointmentService {
	return &AppointmentService{repo: repo}
}

func (s *AppointmentService) CreateAppointment(ctx context.Context, req models.CreateAppointmentRequest, creatorUserID string) (*models.Appointment, error) {
	if req.EndTime.Before(req.StartTime) || req.EndTime.Equal(req.StartTime) {
		return nil, errors.New("o horário de término deve ser posterior ao horário de início")
	}

	hasConflict, err := s.repo.CheckConflict(ctx, req.PatientID, req.StartTime, req.EndTime)
	if err != nil {
		return nil, errors.New("erro ao validar disponibilidade de horário")
	}
	if hasConflict {
		return nil, errors.New("já existe um compromisso agendado para este horário no perfil do paciente")
	}

	app := &models.Appointment{
		PatientID:       req.PatientID,
		CreatedByUserID: creatorUserID,
		Title:           req.Title,
		Specialty:       req.Specialty,
		Location:        req.Location,
		StartTime:       req.StartTime,
		EndTime:         req.EndTime,
	}

	err = s.repo.Create(ctx, app, req.CanEditUserIDs)
	if err != nil {
		return nil, errors.New("falha ao criar agendamento")
	}

	return app, nil
}

func (s *AppointmentService) GetPatientAppointments(ctx context.Context, patientID string) ([]models.Appointment, error) {
	return s.repo.FindByPatient(ctx, patientID)
}

func (s *AppointmentService) UpdateAppointment(ctx context.Context, id string, req models.UpdateAppointmentRequest, userID string) error {
	hasPerm, err := s.repo.HasPermission(ctx, id, userID)
	if err != nil || !hasPerm {
		return errors.New("você não tem permissão para modificar este evento")
	}

	app, err := s.repo.FindByID(ctx, id)
	if err != nil {
		return errors.New("agendamento não encontrado")
	}

	if req.EndTime.Before(req.StartTime) || req.EndTime.Equal(req.StartTime) {
		return errors.New("o horário de término deve ser posterior ao horário de início")
	}

	hasConflict, err := s.repo.CheckConflictForUpdate(ctx, app.PatientID, req.StartTime, req.EndTime, id)
	if err != nil || hasConflict {
		return errors.New("já existe um compromisso agendado para este horário no perfil do paciente")
	}

	return s.repo.Update(ctx, id, req)
}

func (s *AppointmentService) DeleteAppointment(ctx context.Context, id string, userID string) error {
	hasPerm, err := s.repo.HasPermission(ctx, id, userID)
	if err != nil || !hasPerm {
		return errors.New("você não tem permissão para excluir este evento")
	}

	return s.repo.Delete(ctx, id)
}
