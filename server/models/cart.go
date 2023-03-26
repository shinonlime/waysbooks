package models

type Cart struct {
	ID     int  `json:"id"`
	UserID int  `json:"user_id"`
	User   User `json:"-" gorm:"constraint:OnUpdate:CASCADE,OnDelete:CASCADE;"`
	BookID int  `json:"book_id"`
	Book   Book `json:"book" gorm:"constraint:OnUpdate:CASCADE,OnDelete:CASCADE;"`
}
