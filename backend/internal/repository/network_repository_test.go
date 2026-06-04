package repository_test

import (
	"context"
	"testing"

	"conectamed/internal/models"
	"conectamed/internal/repository"

	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/stretchr/testify/assert"
)

func TestNetworkRepository_IntegrationFlow(t *testing.T) {
	dbURL := "postgresql://conectamed_db:conectamed_db@localhost:5432/conectamed?sslmode=disable"
	if dbURL == "" {
		t.Skip("A saltar teste de integração: TEST_DATABASE_URL não configurada")
	}

	ctx := context.Background()
	pool, _ := pgxpool.New(ctx, dbURL)
	defer pool.Close()

	userRepo := repository.NewUserRepository(pool)
	patientRepo := repository.NewPatientRepository(pool)
	netRepo := repository.NewNetworkRepository(pool)

	// 1. SETUP: Criar o Administrador e um Convidado
	adminUser := &models.User{Name: "Admin Rede", Email: "admin.rede@teste.com", PasswordHash: "123"}
	guestUser := &models.User{Name: "Convidado", Email: "convidado.rede@teste.com", PasswordHash: "123"}
	_ = userRepo.Create(ctx, adminUser)
	_ = userRepo.Create(ctx, guestUser)

	defer pool.Exec(ctx, "DELETE FROM users WHERE id IN ($1, $2)", adminUser.ID, guestUser.ID)

	// 2. SETUP: Criar o Paciente (O AdminUser será colocado automaticamente como ADMINISTRADOR)
	patient := &models.Patient{Name: "Paciente da Rede", DateOfBirth: "1980-01-01"}
	_ = patientRepo.Create(ctx, patient, adminUser.ID)

	// 3. TESTE: Adicionar Membro
	err := netRepo.AddMember(ctx, patient.ID, guestUser.ID, "MEMBRO")
	assert.NoError(t, err)

	// 4. TESTE: Listar Membros (Devem ser 2: O Admin e o Convidado)
	members, err := netRepo.GetMembers(ctx, patient.ID)
	assert.NoError(t, err)
	assert.Len(t, members, 2)

	// 5. TESTE: Obter Role (Verificar se o convidado é efetivamente um MEMBRO)
	role, err := netRepo.GetRole(ctx, patient.ID, guestUser.ID)
	assert.NoError(t, err)
	assert.Equal(t, "MEMBRO", role)

	// 6. TESTE: Atualizar Role
	err = netRepo.UpdateRole(ctx, patient.ID, guestUser.ID, "ADMINISTRADOR")
	assert.NoError(t, err)

	roleAtualizada, _ := netRepo.GetRole(ctx, patient.ID, guestUser.ID)
	assert.Equal(t, "ADMINISTRADOR", roleAtualizada)

	// 7. TESTE: Remover Membro
	err = netRepo.RemoveMember(ctx, patient.ID, guestUser.ID)
	assert.NoError(t, err)

	// Garantir que agora só resta 1 membro
	membrosFinais, _ := netRepo.GetMembers(ctx, patient.ID)
	assert.Len(t, membrosFinais, 1)
}
