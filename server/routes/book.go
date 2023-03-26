package routes

import (
	"waysbook/handlers"
	"waysbook/pkg/middleware"
	"waysbook/pkg/mysql"
	"waysbook/repositories"

	"github.com/labstack/echo/v4"
)

func BookRoutes(e *echo.Group) {
	bookRepository := repositories.RepositoryBook(mysql.DB)
	h := handlers.HandlerBook(bookRepository)

	e.GET("/books", h.GetBooks)
	e.GET("/books-top-3", h.GetBooksBySold)
	e.GET("/book/:id", h.FindBookById)
	e.POST("/book", middleware.UploadBook(middleware.UploadImage(h.CreateBook)))
	e.PATCH("/book/:id", middleware.UploadBook(middleware.UploadImage(h.UpdateBook)))
	e.DELETE("/book/:id", middleware.UploadBook(middleware.UploadImage(h.DeleteBook)))
}
