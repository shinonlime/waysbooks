package repositories

import (
	"waysbook/models"

	"gorm.io/gorm"
)

type TransactionRepository interface {
	GetTransaction() ([]models.Transaction, error)
	FindTransaction(ID int) (models.Transaction, error)
	FindTransactionBook(ID int) (models.Transaction, error)
	CreateTransaction(transaction models.Transaction) (models.Transaction, error)
	UpdateTransaction(status string, orderId int) (models.Transaction, error)
	GetTransactionByUserID(UserID int) (models.User, error)
	FindUserTransaction(UserID int) (models.User, error)
	GetBookPurchasedByTransactionID(TransactionID int) ([]models.BookPurchases, error)
}

func RepositoryTransaction(db *gorm.DB) *repository {
	return &repository{db}
}

func (r *repository) GetTransaction() ([]models.Transaction, error) {
	var transaction []models.Transaction

	err := r.db.Preload("BookPurchases").Find(&transaction).Error

	return transaction, err
}

func (r *repository) FindTransaction(ID int) (models.Transaction, error) {
	var transaction models.Transaction

	err := r.db.First(&transaction, ID).Error

	return transaction, err
}

func (r *repository) FindTransactionBook(ID int) (models.Transaction, error) {
	var transaction models.Transaction

	err := r.db.Preload("BookPurchases").First(&transaction, ID).Error

	return transaction, err
}

func (r *repository) CreateTransaction(transaction models.Transaction) (models.Transaction, error) {
	err := r.db.Create(&transaction).Error

	return transaction, err
}

func (r *repository) UpdateTransaction(status string, orderId int) (models.Transaction, error) {
	var transaction models.Transaction
	r.db.Preload("BookPurchases").First(&transaction, orderId)

	if status != transaction.Status && status == "success" {
		for _, bookPurchases := range transaction.BookPurchases {
			var book models.Book
			r.db.First(&book, bookPurchases.BookID)
			book.Sold = book.Sold + 1
			r.db.Save(&book)
		}
	} else if status == "success" && transaction.Status == "success" {
		for _, bookPurchases := range transaction.BookPurchases {
			var book models.Book
			r.db.First(&book, bookPurchases.BookID)
			book.Sold = book.Sold + 1
			r.db.Save(&book)
		}
	}

	transaction.Status = status
	err := r.db.Save(&transaction).Error
	return transaction, err
}

func (r *repository) GetTransactionByUserID(UserID int) (models.User, error) {
	var user models.User

	err := r.db.Preload("Transaction.BookPurchases").First(&user, UserID).Error

	return user, err
}

func (r *repository) FindUserTransaction(UserID int) (models.User, error) {
	var user models.User
	err := r.db.First(&user, UserID).Error

	return user, err
}

func (r *repository) GetBookPurchasedByTransactionID(TransactionID int) ([]models.BookPurchases, error) {
	var book []models.BookPurchases

	err := r.db.Where("transaction_id = ?", TransactionID).Find(&book).Error

	return book, err
}
