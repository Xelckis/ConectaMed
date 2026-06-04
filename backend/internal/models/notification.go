package models

import "time"

type Notification struct {
	ID        string    `json:"id"`
	UserID    string    `json:"-"` // Escondido no JSON por segurança
	Type      string    `json:"type"`
	Title     string    `json:"title"`
	Message   string    `json:"message"`
	Read      bool      `json:"read"`
	RelatedID *string   `json:"relatedId,omitempty"` // Ponteiro porque pode ser nulo na base de dados
	CreatedAt time.Time `json:"createdAt"`
}
