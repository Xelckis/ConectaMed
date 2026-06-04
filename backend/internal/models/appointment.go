package models

import "time"

type Appointment struct {
	ID              string    `json:"id"`
	PatientID       string    `json:"patient_id"`
	CreatedByUserID string    `json:"created_by_user_id"`
	Title           string    `json:"title"`
	Specialty       string    `json:"specialty"`
	Location        string    `json:"location"`
	StartTime       time.Time `json:"start_time"`
	EndTime         time.Time `json:"end_time"`
	Status          string    `json:"status"`
	CreatedAt       time.Time `json:"created_at"`
}

type CreateAppointmentRequest struct {
	PatientID      string    `json:"patient_id" binding:"required"`
	Title          string    `json:"title" binding:"required"`
	Specialty      string    `json:"specialty"`
	Location       string    `json:"location"`
	StartTime      time.Time `json:"start_time" binding:"required"`
	EndTime        time.Time `json:"end_time" binding:"required"`
	CanEditUserIDs []string  `json:"can_edit_user_ids"`
}

type UpdateAppointmentRequest struct {
	Title     string    `json:"title" binding:"required"`
	Specialty string    `json:"specialty"`
	Location  string    `json:"location"`
	StartTime time.Time `json:"start_time" binding:"required"`
	EndTime   time.Time `json:"end_time" binding:"required"`
}
