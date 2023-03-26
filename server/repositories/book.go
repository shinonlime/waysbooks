package repositories

import (
	"waysbook/models"

	"gorm.io/gorm"
)

type BookRepository interface {
	GetBooks() ([]models.Book, error)
	GetBooksBySold() ([]models.Book, error)
	FindBook(BookID int) (models.Book, error)
	CreateBook(book models.Book) (models.Book, error)
	UpdateBook(book models.Book, ID int) (models.Book, error)
	DeleteBook(book models.Book) (models.Book, error)
}

func RepositoryBook(db *gorm.DB) *repository {
	return &repository{db}
}

func (r *repository) GetBooks() ([]models.Book, error) {
	var book []models.Book
	err := r.db.Order("id desc").Find(&book).Error

	return book, err
}

func (r *repository) GetBooksBySold() ([]models.Book, error) {
	var book []models.Book
	err := r.db.Order("sold desc").Limit(3).Find(&book).Error

	return book, err
}

func (r *repository) FindBook(BookID int) (models.Book, error) {
	var book models.Book
	err := r.db.First(&book, BookID).Error

	return book, err
}

func (r *repository) CreateBook(book models.Book) (models.Book, error) {
	err := r.db.Create(&book).Error

	return book, err
}

func (r *repository) UpdateBook(book models.Book, ID int) (models.Book, error) {
	err := r.db.Save(&book).Error

	return book, err
}

func (r *repository) DeleteBook(book models.Book) (models.Book, error) {
	err := r.db.Delete(&book).Error

	return book, err
}
