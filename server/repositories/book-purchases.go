package repositories

import (
	"waysbook/models"

	"gorm.io/gorm"
)

type BookPurchasesRepository interface {
	CreateBookPurchases(bookPurchases models.BookPurchases) (models.BookPurchases, error)
	FindBookPurchased(BookID int) (models.BookPurchases, error)
	GetBookTransactionByUserID(UserID int) (models.Transaction, error)
	GetBookPurchasedByUser(UserID int) (models.User, error)
}

func RepositoryBookPurchases(db *gorm.DB) *repository {
	return &repository{db}
}

func (r *repository) CreateBookPurchases(bookPurchases models.BookPurchases) (models.BookPurchases, error) {
	err := r.db.Create(&bookPurchases).Error

	return bookPurchases, err
}

func (r *repository) FindBookPurchased(BookID int) (models.BookPurchases, error) {
	var book models.BookPurchases

	err := r.db.Where("book_id = ?", BookID).First(&book).Error

	return book, err
}

func (r *repository) GetBookTransactionByUserID(UserID int) (models.Transaction, error) {
	var transaction models.Transaction

	err := r.db.Preload("User").Preload("BookPurchases").Where("user_id = ?", UserID).Where("status = ?", "waiting").First(&transaction).Error

	return transaction, err
}

func (r *repository) GetBookPurchasedByUser(UserID int) (models.User, error) {
	var user models.User

	err := r.db.Preload("BookPurchases.Transaction").First(&user, UserID).Error

	return user, err
}
