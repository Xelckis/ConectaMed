package service

import (
	"context"
	"errors"

	"conectamed/internal/models"

	"github.com/jackc/pgx/v5"
)

type NotificationRepository interface {
	FindByUserID(ctx context.Context, userID string) ([]models.Notification, error)
	MarkAsRead(ctx context.Context, notificationID, userID string) error
}

type NotificationService struct {
	repo NotificationRepository
}

func NewNotificationService(repo NotificationRepository) *NotificationService {
	return &NotificationService{repo: repo}
}

func (s *NotificationService) GetUserNotifications(ctx context.Context, userID string) ([]models.Notification, error) {
	return s.repo.FindByUserID(ctx, userID)
}

func (s *NotificationService) MarkAsRead(ctx context.Context, notificationID, userID string) error {
	err := s.repo.MarkAsRead(ctx, notificationID, userID)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return errors.New("notificação não encontrada ou não tem permissão para a alterar")
		}
		return errors.New("falha ao atualizar notificação")
	}
	return nil
}
