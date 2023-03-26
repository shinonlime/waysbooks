package repositories

import (
	"waysbook/models"

	"gorm.io/gorm"
)

type CartRepository interface {
	FindCart(ID int) (models.Cart, error)
	CreateCart(cart models.Cart) (models.Cart, error)
	FindCartByUserId(ID int) (models.User, error)
	DeleteCart(ID int) (models.Cart, error)
	DeleteUserCart(UserID int) (models.Cart, error)
}

func RepositoryCart(db *gorm.DB) *repository {
	return &repository{db}
}

func (r *repository) FindCart(ID int) (models.Cart, error) {
	var cart models.Cart

	err := r.db.First(&cart, ID).Error

	return cart, err
}

func (r *repository) CreateCart(cart models.Cart) (models.Cart, error) {
	err := r.db.Create(&cart).Error

	return cart, err
}

func (r *repository) FindCartByUserId(ID int) (models.User, error) {
	var user models.User

	err := r.db.Preload("Cart.Book").First(&user, ID).Error

	return user, err
}

func (r *repository) DeleteCart(ID int) (models.Cart, error) {
	var cart models.Cart

	err := r.db.Delete(&cart, ID).Error

	return cart, err
}

func (r *repository) DeleteUserCart(UserID int) (models.Cart, error) {
	var cart models.Cart

	err := r.db.Raw("DELETE FROM `carts` WHERE user_id = ?", UserID).Scan(&cart).Error

	return cart, err
}
