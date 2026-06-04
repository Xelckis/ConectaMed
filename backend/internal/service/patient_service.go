package service

import (
	"context"
	"errors"

	"conectamed/internal/models"
)

type PatientRepository interface {
	Create(ctx context.Context, patient *models.Patient, creatorUserID string) error
	FindAllByUserID(ctx context.Context, userID string) ([]models.Patient, error)
}

type PatientService struct {
	repo PatientRepository
}

func NewPatientService(repo PatientRepository) *PatientService {
	return &PatientService{repo: repo}
}

func (s *PatientService) CreatePatient(ctx context.Context, req models.CreatePatientRequest, userID string) (*models.Patient, error) {
	patient := &models.Patient{
		Name:        req.Name,
		DateOfBirth: req.DateOfBirth,
	}

	err := s.repo.Create(ctx, patient, userID)
	if err != nil {
		return nil, errors.New("falha ao criar paciente")
	}

	return patient, nil
}

func (s *PatientService) GetPatientsByUser(ctx context.Context, userID string) ([]models.Patient, error) {
	patients, err := s.repo.FindAllByUserID(ctx, userID)
	if err != nil {
		return nil, errors.New("falha ao buscar pacientes")
	}
	return patients, nil
}
