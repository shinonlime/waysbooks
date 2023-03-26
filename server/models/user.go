package models

import "time"

type User struct {
	ID            int             `json:"id"`
	IsAdmin       bool            `json:"is_admin" gorm:"type:boolean"`
	Name          string          `json:"name" gorm:"type: varchar(255)"`
	Email         string          `json:"email" gorm:"type: varchar(255)"`
	Password      string          `json:"-" gorm:"type: varchar(255)"`
	Gender        string          `json:"gender" gorm:"type: varchar(255)"`
	Phone         string          `json:"phone" gorm:"type: varchar(255)"`
	Address       string          `json:"address"`
	Image         string          `json:"avatar" gorm:"type: varchar(255)"`
	Cart          []Cart          `json:"cart"`
	Transaction   []Transaction   `json:"transaction"`
	BookPurchases []BookPurchases `json:"book_purchases"`
	CreatedAt     time.Time       `json:"-"`
	UpdatedAt     time.Time       `json:"-"`
}

type UserCartResponse struct {
	ID   int    `json:"id"`
	Cart []Cart `json:"cart"`
}

type ProfileResponse struct {
	ID      int    `json:"id"`
	Name    string `json:"name" gorm:"type: varchar(255)"`
	Email   string `json:"email" gorm:"type: varchar(255)"`
	Gender  string `json:"gender" gorm:"type: varchar(255)"`
	Phone   string `json:"phone" gorm:"type: varchar(255)"`
	Address string `json:"address"`
	Image   string `json:"avatar" gorm:"type: varchar(255)"`
}

func (UserCartResponse) TableName() string {
	return "users"
}

func (ProfileResponse) TableName() string {
	return "users"
}
