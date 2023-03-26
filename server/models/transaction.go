package models

import "time"

type Transaction struct {
	ID            int             `json:"id"`
	Name          string          `json:"name" gorm:"type: varchar(255)"`
	Email         string          `json:"Email" gorm:"type: varchar(255)"`
	Status        string          `json:"status" gorm:"type: varchar(255)"`
	Total         int             `json:"total"`
	UserID        int             `json:"user_id"`
	User          User            `json:"-"`
	BookPurchases []BookPurchases `json:"book_purchases"`
	CreatedAt     time.Time       `json:"created_at"`
	UpdatedAt     time.Time       `json:"updated_at"`
}
