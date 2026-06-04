package service_test

import (
	"context"
	"testing"

	"conectamed/internal/models"
	"conectamed/internal/service"

	"github.com/jackc/pgx/v5"
	"github.com/stretchr/testify/assert"
)

// 1. Mocks
type MockNetworkRepository struct {
	MockGetRole      func(ctx context.Context, patientID, userID string) (string, error)
	MockGetMembers   func(ctx context.Context, patientID string) ([]models.NetworkMember, error)
	MockAddMember    func(ctx context.Context, patientID, userID, role string) error
	MockUpdateRole   func(ctx context.Context, patientID, userID, role string) error
	MockRemoveMember func(ctx context.Context, patientID, userID string) error
}

func (m *MockNetworkRepository) GetRole(ctx context.Context, patientID, userID string) (string, error) {
	return m.MockGetRole(ctx, patientID, userID)
}
func (m *MockNetworkRepository) GetMembers(ctx context.Context, patientID string) ([]models.NetworkMember, error) {
	return m.MockGetMembers(ctx, patientID)
}
func (m *MockNetworkRepository) AddMember(ctx context.Context, patientID, userID, role string) error {
	return m.MockAddMember(ctx, patientID, userID, role)
}
func (m *MockNetworkRepository) UpdateRole(ctx context.Context, patientID, userID, role string) error {
	return m.MockUpdateRole(ctx, patientID, userID, role)
}
func (m *MockNetworkRepository) RemoveMember(ctx context.Context, patientID, userID string) error {
	return m.MockRemoveMember(ctx, patientID, userID)
}

type MockUserFinder struct {
	MockFindByEmail func(ctx context.Context, email string) (*models.User, error)
}

func (m *MockUserFinder) FindByEmail(ctx context.Context, email string) (*models.User, error) {
	return m.MockFindByEmail(ctx, email)
}

func TestNetworkService_AddMember_Success(t *testing.T) {
	mockRepo := &MockNetworkRepository{
		MockGetRole: func(ctx context.Context, patientID, userID string) (string, error) {
			return "ADMINISTRADOR", nil // O requerente tem permissão
		},
		MockAddMember: func(ctx context.Context, patientID, userID, role string) error {
			return nil
		},
	}
	mockFinder := &MockUserFinder{
		MockFindByEmail: func(ctx context.Context, email string) (*models.User, error) {
			return &models.User{ID: "novo-utilizador-123", Email: email}, nil
		},
	}
	svc := service.NewNetworkService(mockRepo, mockFinder)

	req := models.AddNetworkMemberRequest{Email: "amigo@teste.com", Role: "MEMBRO"}
	err := svc.AddMember(context.Background(), "paciente-123", req, "requerente-admin")

	assert.NoError(t, err)
}

func TestNetworkService_AddMember_Forbidden(t *testing.T) {
	mockRepo := &MockNetworkRepository{
		MockGetRole: func(ctx context.Context, patientID, userID string) (string, error) {
			return "MEMBRO", nil // O requerente é apenas membro
		},
	}
	svc := service.NewNetworkService(mockRepo, &MockUserFinder{})

	req := models.AddNetworkMemberRequest{Email: "amigo@teste.com", Role: "MEMBRO"}
	err := svc.AddMember(context.Background(), "paciente-123", req, "requerente-membro")

	assert.Error(t, err)
	assert.Equal(t, "apenas administradores podem gerir a rede de apoio", err.Error())
}

func TestNetworkService_AddMember_UserNotFound(t *testing.T) {
	mockRepo := &MockNetworkRepository{
		MockGetRole: func(ctx context.Context, patientID, userID string) (string, error) {
			return "ADMINISTRADOR", nil
		},
	}
	mockFinder := &MockUserFinder{
		MockFindByEmail: func(ctx context.Context, email string) (*models.User, error) {
			return nil, pgx.ErrNoRows // Simula que o e-mail não existe na base de dados
		},
	}
	svc := service.NewNetworkService(mockRepo, mockFinder)

	req := models.AddNetworkMemberRequest{Email: "fantasma@teste.com", Role: "MEMBRO"}
	err := svc.AddMember(context.Background(), "paciente-123", req, "requerente-admin")

	assert.Error(t, err)
	assert.Equal(t, "utilizador com este e-mail não encontrado no sistema", err.Error())
}
