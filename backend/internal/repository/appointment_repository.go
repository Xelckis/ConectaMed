package repository

import (
	"context"
	"time"

	"conectamed/internal/models"

	"github.com/jackc/pgx/v5/pgxpool"
)

type AppointmentRepository struct {
	db *pgxpool.Pool
}

func NewAppointmentRepository(db *pgxpool.Pool) *AppointmentRepository {
	return &AppointmentRepository{db: db}
}

func (r *AppointmentRepository) CheckConflict(ctx context.Context, patientID string, start, end time.Time) (bool, error) {
	var exists bool
	query := `
		SELECT EXISTS(
			SELECT 1 FROM appointments 
			WHERE patient_id = $1 
			  AND status != 'CANCELLED'
			  AND start_time < $3 
			  AND end_time > $2
		)
	`
	err := r.db.QueryRow(ctx, query, patientID, start, end).Scan(&exists)
	return exists, err
}

func (r *AppointmentRepository) Create(ctx context.Context, app *models.Appointment, permittedUserIDs []string) error {
	tx, err := r.db.Begin(ctx)
	if err != nil {
		return err
	}
	defer tx.Rollback(ctx)

	queryApp := `
		INSERT INTO appointments (patient_id, created_by_user_id, title, specialty, location, start_time, end_time)
		VALUES ($1, $2, $3, $4, $5, $6, $7)
		RETURNING id, status, created_at
	`
	err = tx.QueryRow(ctx, queryApp, app.PatientID, app.CreatedByUserID, app.Title, app.Specialty, app.Location, app.StartTime, app.EndTime).Scan(&app.ID, &app.Status, &app.CreatedAt)
	if err != nil {
		return err
	}

	if len(permittedUserIDs) > 0 {
		queryPerm := `INSERT INTO appointment_permissions (appointment_id, user_id) VALUES ($1, $2)`
		for _, userID := range permittedUserIDs {
			_, err = tx.Exec(ctx, queryPerm, app.ID, userID)
			if err != nil {
				return err
			}
		}
	}

	return tx.Commit(ctx)
}

func (r *AppointmentRepository) FindByPatient(ctx context.Context, patientID string) ([]models.Appointment, error) {
	query := `
		SELECT id, patient_id, created_by_user_id, title, specialty, location, start_time, end_time, status, created_at 
		FROM appointments 
		WHERE patient_id = $1
		ORDER BY start_time ASC
	`
	rows, err := r.db.Query(ctx, query, patientID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var apps []models.Appointment
	for rows.Next() {
		var a models.Appointment
		if err := rows.Scan(&a.ID, &a.PatientID, &a.CreatedByUserID, &a.Title, &a.Specialty, &a.Location, &a.StartTime, &a.EndTime, &a.Status, &a.CreatedAt); err != nil {
			return nil, err
		}
		apps = append(apps, a)
	}

	if apps == nil {
		apps = []models.Appointment{}
	}
	return apps, nil
}

func (r *AppointmentRepository) FindByID(ctx context.Context, id string) (*models.Appointment, error) {
	var app models.Appointment
	query := `SELECT id, patient_id, created_by_user_id, title, specialty, location, start_time, end_time, status, created_at FROM appointments WHERE id = $1`
	err := r.db.QueryRow(ctx, query, id).Scan(&app.ID, &app.PatientID, &app.CreatedByUserID, &app.Title, &app.Specialty, &app.Location, &app.StartTime, &app.EndTime, &app.Status, &app.CreatedAt)
	return &app, err
}

func (r *AppointmentRepository) HasPermission(ctx context.Context, appointmentID, userID string) (bool, error) {
	var hasPerm bool
	query := `
		SELECT EXISTS (
			SELECT 1 FROM appointments a
			WHERE a.id = $1
			AND (
				a.created_by_user_id = $2 
				OR EXISTS (SELECT 1 FROM appointment_permissions ap WHERE ap.appointment_id = $1 AND ap.user_id = $2)
				OR EXISTS (SELECT 1 FROM care_networks cn WHERE cn.patient_id = a.patient_id AND cn.user_id = $2 AND cn.role = 'ADMINISTRADOR')
			)
		)
	`
	err := r.db.QueryRow(ctx, query, appointmentID, userID).Scan(&hasPerm)
	return hasPerm, err
}

func (r *AppointmentRepository) CheckConflictForUpdate(ctx context.Context, patientID string, start, end time.Time, excludeAppID string) (bool, error) {
	var exists bool
	query := `
		SELECT EXISTS(
			SELECT 1 FROM appointments 
			WHERE patient_id = $1 
			  AND id != $4
			  AND status != 'CANCELLED'
			  AND start_time < $3 
			  AND end_time > $2
		)
	`
	err := r.db.QueryRow(ctx, query, patientID, start, end, excludeAppID).Scan(&exists)
	return exists, err
}

func (r *AppointmentRepository) Update(ctx context.Context, id string, req models.UpdateAppointmentRequest) error {
	query := `
		UPDATE appointments 
		SET title = $1, specialty = $2, location = $3, start_time = $4, end_time = $5
		WHERE id = $6
	`
	_, err := r.db.Exec(ctx, query, req.Title, req.Specialty, req.Location, req.StartTime, req.EndTime, id)
	return err
}

func (r *AppointmentRepository) Delete(ctx context.Context, id string) error {
	query := `DELETE FROM appointments WHERE id = $1`
	_, err := r.db.Exec(ctx, query, id)
	return err
}
