package database

import (
	"fmt"
	"waysbook/models"
	"waysbook/pkg/mysql"
)

func RunMigration() {
	err := mysql.DB.AutoMigrate(&models.User{}, &models.Book{}, &models.Cart{}, &models.Transaction{}, &models.BookPurchases{})

	if err != nil {
		fmt.Println(err)
		panic("Migration failed")
	}

	fmt.Println("Migration success")
}
