package routes

import "github.com/labstack/echo/v4"

func RouteInit(e *echo.Group) {
	UserRoutes(e)
	BookRoutes(e)
	CartRoutes(e)
	TransactionRoutes(e)
	BookPurchasesRoutes(e)
}
