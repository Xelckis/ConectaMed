package models

import "time"

type NetworkMember struct {
	UserID   string    `json:"user_id"`
	Name     string    `json:"name"`
	Email    string    `json:"email"`
	Role     string    `json:"role"` // 'ADMINISTRADOR' ou 'MEMBRO'
	JoinedAt time.Time `json:"joined_at"`
}

type AddNetworkMemberRequest struct {
	Email string `json:"email" binding:"required,email"`
	Role  string `json:"role" binding:"required,oneof=ADMINISTRADOR MEMBRO"`
}

type UpdateNetworkRoleRequest struct {
	Role string `json:"role" binding:"required,oneof=ADMINISTRADOR MEMBRO"`
}
