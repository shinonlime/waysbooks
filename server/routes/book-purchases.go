package routes

import (
	"waysbook/handlers"
	"waysbook/pkg/middleware"
	"waysbook/pkg/mysql"
	"waysbook/repositories"

	"github.com/labstack/echo/v4"
)

func BookPurchasesRoutes(e *echo.Group) {
	bookPurchasesRepository := repositories.RepositoryBookPurchases(mysql.DB)
	h := handlers.HandlerBookPurchases(bookPurchasesRepository)

	e.GET("/user/book", middleware.Auth(h.GetBookPurchasedByUser))
	e.GET("/book-purchased/:id", h.FindBookPurchased)
	e.POST("/book-purchase", middleware.Auth(h.CreateBookPurchases))
}
