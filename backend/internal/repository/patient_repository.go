package repository

import (
	"conectamed/internal/models"
	"context"
	"github.com/jackc/pgx/v5/pgxpool"
)

type PatientRepository struct {
	db *pgxpool.Pool
}

func NewPatientRepository(db *pgxpool.Pool) *PatientRepository {
	return &PatientRepository{db: db}
}

func (r *PatientRepository) Create(ctx context.Context, patient *models.Patient, creatorUserID string) error {
	tx, err := r.db.Begin(ctx)
	if err != nil {
		return err
	}
	defer tx.Rollback(ctx)

	queryPatient := `
		INSERT INTO patients (name, date_of_birth)
		VALUES ($1, $2)
		RETURNING id, created_at
	`
	err = tx.QueryRow(ctx, queryPatient, patient.Name, patient.DateOfBirth).Scan(&patient.ID, &patient.CreatedAt)
	if err != nil {
		return err
	}

	queryNetwork := `
		INSERT INTO care_networks (patient_id, user_id, role)
		VALUES ($1, $2, 'ADMINISTRADOR')
	`
	_, err = tx.Exec(ctx, queryNetwork, patient.ID, creatorUserID)
	if err != nil {
		return err
	}

	return tx.Commit(ctx)
}

func (r *PatientRepository) FindAllByUserID(ctx context.Context, userID string) ([]models.Patient, error) {
	query := `
		SELECT p.id, p.name, p.date_of_birth::text, p.created_at 
		FROM patients p
		INNER JOIN care_networks cn ON p.id = cn.patient_id
		WHERE cn.user_id = $1
		ORDER BY p.name ASC
	`
	rows, err := r.db.Query(ctx, query, userID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var patients []models.Patient
	for rows.Next() {
		var p models.Patient
		if err := rows.Scan(&p.ID, &p.Name, &p.DateOfBirth, &p.CreatedAt); err != nil {
			return nil, err
		}
		patients = append(patients, p)
	}

	if patients == nil {
		patients = []models.Patient{}
	}

	return patients, nil
}
