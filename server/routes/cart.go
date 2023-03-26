package routes

import (
	"waysbook/handlers"
	"waysbook/pkg/middleware"
	"waysbook/pkg/mysql"
	"waysbook/repositories"

	"github.com/labstack/echo/v4"
)

func CartRoutes(e *echo.Group) {
	cartRepository := repositories.RepositoryCart(mysql.DB)
	h := handlers.HandlerCart(cartRepository)

	e.POST("/cart", middleware.Auth(h.CreateCart))
	e.GET("/user/cart", middleware.Auth(h.FindCartByUserId))
	e.DELETE("/cart/:id", h.DeleteCart)
	e.DELETE("/user/cart/delete", middleware.Auth(h.DeleteUserCart))
}
