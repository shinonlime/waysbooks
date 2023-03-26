package routes

import (
	"waysbook/handlers"
	"waysbook/pkg/middleware"
	"waysbook/pkg/mysql"
	"waysbook/repositories"

	"github.com/labstack/echo/v4"
)

func UserRoutes(e *echo.Group) {
	userRepository := repositories.RepositoryUser(mysql.DB)
	h := handlers.HandlerUser(userRepository)

	e.POST("/register", h.Register)
	e.POST("/login", h.Login)
	e.GET("/check-auth", middleware.Auth(h.CheckAuth))

	e.GET("/users", h.GetUsers)
	e.GET("/profile", middleware.Auth(h.FindUser))
	e.PATCH("/update-profile", middleware.Auth(middleware.UploadImage(h.UpdateUser)))
}
