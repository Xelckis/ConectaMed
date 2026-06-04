package handler

import (
	"net/http"

	"conectamed/internal/models"
	"conectamed/internal/service"

	"github.com/gin-gonic/gin"
)

type NetworkHandler struct {
	service *service.NetworkService
}

func NewNetworkHandler(service *service.NetworkService) *NetworkHandler {
	return &NetworkHandler{service: service}
}

func (h *NetworkHandler) List(c *gin.Context) {
	requesterID := c.MustGet("userID").(string)
	patientID := c.Param("patient_id")

	members, err := h.service.ListMembers(c.Request.Context(), patientID, requesterID)
	if err != nil {
		c.JSON(http.StatusForbidden, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, members)
}

func (h *NetworkHandler) Add(c *gin.Context) {
	requesterID := c.MustGet("userID").(string)
	patientID := c.Param("patient_id")

	var req models.AddNetworkMemberRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Dados inválidos", "details": err.Error()})
		return
	}

	err := h.service.AddMember(c.Request.Context(), patientID, req, requesterID)
	if err != nil {
		if err.Error() == "utilizador com este e-mail não encontrado no sistema" {
			c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
			return
		}
		c.JSON(http.StatusForbidden, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"message": "Membro adicionado à rede de apoio"})
}

func (h *NetworkHandler) UpdateRole(c *gin.Context) {
	requesterID := c.MustGet("userID").(string)
	patientID := c.Param("patient_id")
	targetUserID := c.Param("user_id")

	var req models.UpdateNetworkRoleRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Dados inválidos"})
		return
	}

	err := h.service.UpdateMemberRole(c.Request.Context(), patientID, targetUserID, req, requesterID)
	if err != nil {
		c.JSON(http.StatusForbidden, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Privilégios atualizados com sucesso"})
}

func (h *NetworkHandler) Remove(c *gin.Context) {
	requesterID := c.MustGet("userID").(string)
	patientID := c.Param("patient_id")
	targetUserID := c.Param("user_id")

	err := h.service.RemoveMember(c.Request.Context(), patientID, targetUserID, requesterID)
	if err != nil {
		c.JSON(http.StatusForbidden, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Membro removido da rede de apoio"})
}
