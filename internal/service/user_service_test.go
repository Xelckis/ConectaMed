package service_test

import (
	"context"
	"testing"

	"conectamed/internal/models"
	"conectamed/internal/service"

	"github.com/jackc/pgx/v5"
	"github.com/stretchr/testify/assert"
	"golang.org/x/crypto/bcrypt"
)

type MockUserRepository struct {
	MockCreate      func(ctx context.Context, user *models.User) error
	MockFindByEmail func(ctx context.Context, email string) (*models.User, error)
}

func (m *MockUserRepository) Create(ctx context.Context, user *models.User) error {
	return m.MockCreate(ctx, user)
}

func (m *MockUserRepository) FindByEmail(ctx context.Context, email string) (*models.User, error) {
	return m.MockFindByEmail(ctx, email)
}

func TestLogin_Success(t *testing.T) {
	hashedPassword, _ := bcrypt.GenerateFromPassword([]byte("senha123"), bcrypt.DefaultCost)

	mockRepo := &MockUserRepository{
		MockFindByEmail: func(ctx context.Context, email string) (*models.User, error) {
			return &models.User{
				ID:           "id-123",
				Email:        email,
				PasswordHash: string(hashedPassword),
			}, nil
		},
	}
	svc := service.NewUserService(mockRepo)

	req := models.LoginRequest{
		Email:    "teste@teste.com",
		Password: "senha123",
	}

	token, err := svc.Login(context.Background(), req)

	assert.NoError(t, err)
	assert.NotEmpty(t, token)
}

func TestLogin_WrongPassword(t *testing.T) {
	hashedPassword, _ := bcrypt.GenerateFromPassword([]byte("senha123"), bcrypt.DefaultCost)

	mockRepo := &MockUserRepository{
		MockFindByEmail: func(ctx context.Context, email string) (*models.User, error) {
			return &models.User{
				Email:        email,
				PasswordHash: string(hashedPassword),
			}, nil
		},
	}
	svc := service.NewUserService(mockRepo)

	req := models.LoginRequest{Email: "teste@teste.com", Password: "senha-errada"}
	token, err := svc.Login(context.Background(), req)

	assert.Error(t, err)
	assert.Empty(t, token)
	assert.Equal(t, "credenciais inválidas", err.Error())
}

func TestLogin_UserNotFound(t *testing.T) {
	mockRepo := &MockUserRepository{
		MockFindByEmail: func(ctx context.Context, email string) (*models.User, error) {
			return nil, pgx.ErrNoRows
		},
	}
	svc := service.NewUserService(mockRepo)

	req := models.LoginRequest{Email: "inexistente@teste.com", Password: "123"}
	token, err := svc.Login(context.Background(), req)

	assert.Error(t, err)
	assert.Empty(t, token)
	assert.Equal(t, "credenciais inválidas", err.Error())
}
