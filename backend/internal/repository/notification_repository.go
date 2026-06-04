package repository

import (
	"context"

	"conectamed/internal/models"

	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
)

type NotificationRepository struct {
	db *pgxpool.Pool
}

func NewNotificationRepository(db *pgxpool.Pool) *NotificationRepository {
	return &NotificationRepository{db: db}
}

func (r *NotificationRepository) FindByUserID(ctx context.Context, userID string) ([]models.Notification, error) {
	query := `
		SELECT id, user_id, type, title, message, read, related_id, created_at 
		FROM notifications 
		WHERE user_id = $1 
		ORDER BY created_at DESC
	`
	rows, err := r.db.Query(ctx, query, userID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var notifications []models.Notification
	for rows.Next() {
		var n models.Notification
		if err := rows.Scan(&n.ID, &n.UserID, &n.Type, &n.Title, &n.Message, &n.Read, &n.RelatedID, &n.CreatedAt); err != nil {
			return nil, err
		}
		notifications = append(notifications, n)
	}

	if notifications == nil {
		notifications = []models.Notification{}
	}
	return notifications, nil
}

func (r *NotificationRepository) MarkAsRead(ctx context.Context, notificationID, userID string) error {
	query := `UPDATE notifications SET read = TRUE WHERE id = $1 AND user_id = $2`

	commandTag, err := r.db.Exec(ctx, query, notificationID, userID)
	if err != nil {
		return err
	}

	if commandTag.RowsAffected() == 0 {
		return pgx.ErrNoRows
	}

	return nil
}

func (r *NotificationRepository) Create(ctx context.Context, n *models.Notification) error {
	query := `
		INSERT INTO notifications (user_id, type, title, message, related_id)
		VALUES ($1, $2, $3, $4, $5)
		RETURNING id, read, created_at
	`
	err := r.db.QueryRow(ctx, query, n.UserID, n.Type, n.Title, n.Message, n.RelatedID).Scan(&n.ID, &n.Read, &n.CreatedAt)
	return err
}
