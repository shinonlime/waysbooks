package models

import "time"

type BookPurchases struct {
	ID              int         `json:"id"`
	UserID          int         `json:"user_id"`
	User            User        `json:"-" gorm:"constraint:OnUpdate:CASCADE,OnDelete:CASCADE;"`
	BookID          int         `json:"book_id" gorm:"type: int(11)"`
	Title           string      `json:"title" gorm:"type: varchar(255)"`
	PublicationDate string      `json:"publication_date" gorm:"type: varchar(255)"`
	Pages           int         `json:"pages" gorm:"type: int(11)"`
	ISBN            int         `json:"isbn"`
	Writer          string      `json:"writer" gorm:"type: varchar(255)"`
	Price           int         `json:"price" gorm:"type: int(11)"`
	Description     string      `json:"description"`
	BookAttachment  string      `json:"book_attachment"`
	Thumbnail       string      `json:"thumbnail"`
	TransactionID   int         `json:"transaction_id"`
	Transaction     Transaction `json:"transaction" gorm:"constraint:OnUpdate:CASCADE,OnDelete:CASCADE;"`
	CreatedAt       time.Time   `json:"created_at"`
	UpdatedAt       time.Time   `json:"updated_at"`
}
