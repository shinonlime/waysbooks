package handlers

import (
	"net/http"
	"strconv"
	bookpurchasesdto "waysbook/dto/book-purchases"
	dto "waysbook/dto/result"
	"waysbook/models"
	"waysbook/repositories"

	"github.com/golang-jwt/jwt/v4"
	"github.com/labstack/echo/v4"
)

type handlerBookPurchases struct {
	BookPurchasesRepository repositories.BookPurchasesRepository
}

func HandlerBookPurchases(BookPurchasesRepository repositories.BookPurchasesRepository) *handlerBookPurchases {
	return &handlerBookPurchases{BookPurchasesRepository}
}

func (h *handlerBookPurchases) CreateBookPurchases(c echo.Context) error {
	request := new(bookpurchasesdto.BookPurchasesRequest)
	if err := c.Bind(request); err != nil {
		return c.JSON(http.StatusBadRequest, dto.ErrorResult{Code: http.StatusBadRequest, Message: err.Error()})
	}

	userLogin := c.Get("userLogin")
	userID := userLogin.(jwt.MapClaims)["id"].(float64)

	userTransaction, _ := h.BookPurchasesRepository.GetBookTransactionByUserID(int(userID))

	bookPurchases := models.BookPurchases{
		UserID:          int(userID),
		BookID:          request.BookID,
		Title:           request.Title,
		PublicationDate: request.PublicationDate,
		Pages:           request.Pages,
		ISBN:            request.ISBN,
		Writer:          request.Writer,
		Price:           request.Price,
		Description:     request.Description,
		BookAttachment:  request.BookAttachment,
		Thumbnail:       request.Thumbnail,
		TransactionID:   userTransaction.ID,
	}

	bookPurchasesData, err := h.BookPurchasesRepository.CreateBookPurchases(bookPurchases)

	if err != nil {
		return c.JSON(http.StatusInternalServerError, dto.ErrorResult{Code: http.StatusInternalServerError, Message: err.Error()})
	}

	return c.JSON(http.StatusOK, dto.SuccessResult{Code: http.StatusOK, Data: bookPurchasesData})
}

func (h *handlerBookPurchases) FindBookPurchased(c echo.Context) error {
	id, _ := strconv.Atoi(c.Param("id"))

	var book models.BookPurchases
	book, err := h.BookPurchasesRepository.FindBookPurchased(id)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, dto.ErrorResult{Code: http.StatusBadRequest, Message: err.Error()})
	}

	return c.JSON(http.StatusOK, dto.SuccessResult{Code: http.StatusOK, Data: book})
}

func (h *handlerBookPurchases) GetBookPurchasedByUser(c echo.Context) error {
	userLogin := c.Get("userLogin")
	userID := userLogin.(jwt.MapClaims)["id"].(float64)

	book_purchases, err := h.BookPurchasesRepository.GetBookPurchasedByUser(int(userID))
	if err != nil {
		return c.JSON(http.StatusInternalServerError, dto.ErrorResult{Code: http.StatusInternalServerError, Message: err.Error()})
	}

	return c.JSON(http.StatusOK, dto.SuccessResult{Code: http.StatusOK, Data: book_purchases})
}
