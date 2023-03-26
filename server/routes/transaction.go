package routes

import (
	"waysbook/handlers"
	"waysbook/pkg/middleware"
	"waysbook/pkg/mysql"
	"waysbook/repositories"

	"github.com/labstack/echo/v4"
)

func TransactionRoutes(e *echo.Group) {
	transactionRepository := repositories.RepositoryTransaction(mysql.DB)
	h := handlers.HandleTransaction(transactionRepository)

	e.GET("/user/transaction", middleware.Auth(h.GetTransactionByUserID))
	e.GET("/transaction", middleware.Auth(h.GetTransaction))
	e.GET("/transaction/:id", h.FindTransaction)
	e.POST("/transaction", middleware.Auth(h.CreateTransaction))
	e.POST("/notification", h.Notification)
}
