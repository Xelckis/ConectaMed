package service

import (
	"context"
	"errors"

	"conectamed/internal/models"

	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgconn"
)

type NetworkRepository interface {
	GetRole(ctx context.Context, patientID, userID string) (string, error)
	GetMembers(ctx context.Context, patientID string) ([]models.NetworkMember, error)
	AddMember(ctx context.Context, patientID, userID, role string) error
	UpdateRole(ctx context.Context, patientID, userID, role string) error
	RemoveMember(ctx context.Context, patientID, userID string) error
}

// UserFinder permite reaproveitar a função FindByEmail do UserRepository
type UserFinder interface {
	FindByEmail(ctx context.Context, email string) (*models.User, error)
}

type NetworkService struct {
	repo       NetworkRepository
	userFinder UserFinder
}

func NewNetworkService(repo NetworkRepository, userFinder UserFinder) *NetworkService {
	return &NetworkService{repo: repo, userFinder: userFinder}
}

// isRequesterAdmin é uma função auxiliar interna para validar permissões
func (s *NetworkService) isRequesterAdmin(ctx context.Context, patientID, requesterID string) error {
	role, err := s.repo.GetRole(ctx, patientID, requesterID)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return errors.New("não faz parte da rede de apoio deste paciente")
		}
		return errors.New("erro ao verificar permissões")
	}
	if role != "ADMINISTRADOR" {
		return errors.New("apenas administradores podem gerir a rede de apoio")
	}
	return nil
}

func (s *NetworkService) ListMembers(ctx context.Context, patientID, requesterID string) ([]models.NetworkMember, error) {
	// Apenas membros da rede podem ver quem está na rede
	_, err := s.repo.GetRole(ctx, patientID, requesterID)
	if err != nil {
		return nil, errors.New("acesso negado à rede deste paciente")
	}
	return s.repo.GetMembers(ctx, patientID)
}

func (s *NetworkService) AddMember(ctx context.Context, patientID string, req models.AddNetworkMemberRequest, requesterID string) error {
	if err := s.isRequesterAdmin(ctx, patientID, requesterID); err != nil {
		return err
	}

	user, err := s.userFinder.FindByEmail(ctx, req.Email)
	if err != nil {
		return errors.New("utilizador com este e-mail não encontrado no sistema")
	}

	err = s.repo.AddMember(ctx, patientID, user.ID, req.Role)
	if err != nil {
		var pgErr *pgconn.PgError
		if errors.As(err, &pgErr) && pgErr.Code == "23505" { // Código Unique Violation
			return errors.New("este utilizador já faz parte da rede de apoio")
		}
		return errors.New("falha ao adicionar membro à rede")
	}
	return nil
}

func (s *NetworkService) UpdateMemberRole(ctx context.Context, patientID, targetUserID string, req models.UpdateNetworkRoleRequest, requesterID string) error {
	if err := s.isRequesterAdmin(ctx, patientID, requesterID); err != nil {
		return err
	}
	return s.repo.UpdateRole(ctx, patientID, targetUserID, req.Role)
}

func (s *NetworkService) RemoveMember(ctx context.Context, patientID, targetUserID, requesterID string) error {
	if err := s.isRequesterAdmin(ctx, patientID, requesterID); err != nil {
		return err
	}
	if targetUserID == requesterID {
		return errors.New("não pode remover-se a si próprio por esta via")
	}
	return s.repo.RemoveMember(ctx, patientID, targetUserID)
}
