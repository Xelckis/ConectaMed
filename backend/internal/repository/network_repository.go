package repository

import (
	"context"

	"conectamed/internal/models"

	"github.com/jackc/pgx/v5/pgxpool"
)

type NetworkRepository struct {
	db *pgxpool.Pool
}

func NewNetworkRepository(db *pgxpool.Pool) *NetworkRepository {
	return &NetworkRepository{db: db}
}

func (r *NetworkRepository) GetRole(ctx context.Context, patientID, userID string) (string, error) {
	var role string
	query := `SELECT role FROM care_networks WHERE patient_id = $1 AND user_id = $2`
	err := r.db.QueryRow(ctx, query, patientID, userID).Scan(&role)
	return role, err
}

func (r *NetworkRepository) GetMembers(ctx context.Context, patientID string) ([]models.NetworkMember, error) {
	query := `
		SELECT u.id, u.name, u.email, cn.role, cn.joined_at 
		FROM care_networks cn
		JOIN users u ON cn.user_id = u.id
		WHERE cn.patient_id = $1
		ORDER BY cn.joined_at ASC
	`
	rows, err := r.db.Query(ctx, query, patientID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var members []models.NetworkMember
	for rows.Next() {
		var m models.NetworkMember
		if err := rows.Scan(&m.UserID, &m.Name, &m.Email, &m.Role, &m.JoinedAt); err != nil {
			return nil, err
		}
		members = append(members, m)
	}

	if members == nil {
		members = []models.NetworkMember{}
	}
	return members, nil
}

func (r *NetworkRepository) AddMember(ctx context.Context, patientID, userID, role string) error {
	query := `INSERT INTO care_networks (patient_id, user_id, role) VALUES ($1, $2, $3)`
	_, err := r.db.Exec(ctx, query, patientID, userID, role)
	return err
}

func (r *NetworkRepository) UpdateRole(ctx context.Context, patientID, userID, role string) error {
	query := `UPDATE care_networks SET role = $1 WHERE patient_id = $2 AND user_id = $3`
	_, err := r.db.Exec(ctx, query, role, patientID, userID)
	return err
}

func (r *NetworkRepository) RemoveMember(ctx context.Context, patientID, userID string) error {
	query := `DELETE FROM care_networks WHERE patient_id = $1 AND user_id = $2`
	_, err := r.db.Exec(ctx, query, patientID, userID)
	return err
}
