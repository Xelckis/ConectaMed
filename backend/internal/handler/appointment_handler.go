package handler

import (
	"net/http"

	"conectamed/internal/models"
	"conectamed/internal/service"

	"github.com/gin-gonic/gin"
)

type AppointmentHandler struct {
	service *service.AppointmentService
}

func NewAppointmentHandler(service *service.AppointmentService) *AppointmentHandler {
	return &AppointmentHandler{service: service}
}

func (h *AppointmentHandler) Create(c *gin.Context) {
	userID := c.MustGet("userID").(string)

	var req models.CreateAppointmentRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Dados inválidos", "details": err.Error()})
		return
	}

	app, err := h.service.CreateAppointment(c.Request.Context(), req, userID)
	if err != nil {
		if err.Error() == "já existe um compromisso agendado para este horário no perfil do paciente" {
			c.JSON(http.StatusConflict, gin.H{"error": err.Error()})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, app)
}

func (h *AppointmentHandler) ListByPatient(c *gin.Context) {
	patientID := c.Param("patient_id")
	if patientID == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "ID do paciente é obrigatório"})
		return
	}

	apps, err := h.service.GetPatientAppointments(c.Request.Context(), patientID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, apps)
}

func (h *AppointmentHandler) Update(c *gin.Context) {
	userID := c.MustGet("userID").(string)
	appointmentID := c.Param("id")

	var req models.UpdateAppointmentRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Dados inválidos", "details": err.Error()})
		return
	}

	err := h.service.UpdateAppointment(c.Request.Context(), appointmentID, req, userID)
	if err != nil {
		if err.Error() == "você não tem permissão para modificar este evento" {
			c.JSON(http.StatusForbidden, gin.H{"error": err.Error()}) // 403
			return
		}
		if err.Error() == "já existe um compromisso agendado para este horário no perfil do paciente" {
			c.JSON(http.StatusConflict, gin.H{"error": err.Error()}) // 409
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Agendamento atualizado com sucesso"})
}

func (h *AppointmentHandler) Delete(c *gin.Context) {
	userID := c.MustGet("userID").(string)
	appointmentID := c.Param("id")

	err := h.service.DeleteAppointment(c.Request.Context(), appointmentID, userID)
	if err != nil {
		if err.Error() == "você não tem permissão para excluir este evento" {
			c.JSON(http.StatusForbidden, gin.H{"error": err.Error()})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Agendamento cancelado com sucesso"})
}
