package models

import "time"

type Book struct {
	ID              int       `json:"id"`
	Title           string    `json:"title" gorm:"type: varchar(255)"`
	PublicationDate string    `json:"publication_date" gorm:"type: varchar(255)"`
	Pages           int       `json:"pages" gorm:"type: int(11)"`
	ISBN            int       `json:"isbn"`
	Writer          string    `json:"writer" gorm:"type: varchar(255)"`
	Price           int       `json:"price" gorm:"type: int(11)"`
	Description     string    `json:"description"`
	BookAttachment  string    `json:"book_attachment"`
	Thumbnail       string    `json:"thumbnail"`
	Sold            int       `json:"sold" gorm:"type: int(11)"`
	CreatedAt       time.Time `json:"created_at"`
	UpdatedAt       time.Time `json:"updated_at"`
}
