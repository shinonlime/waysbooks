package middleware

import (
	"io"
	"io/ioutil"
	"net/http"

	"github.com/labstack/echo/v4"
)

func UploadBook(next echo.HandlerFunc) echo.HandlerFunc {
	return func(c echo.Context) error {
		fileBook, err := c.FormFile("book_attachment")

		if fileBook != nil {
			if err != nil {
				return c.JSON(http.StatusBadRequest, err)
			}

			src, err := fileBook.Open()
			if err != nil {
				return c.JSON(http.StatusBadRequest, err)
			}
			defer src.Close()

			tempFile, err := ioutil.TempFile("uploads", "book-*.pdf")
			if err != nil {
				return c.JSON(http.StatusBadRequest, err)
			}
			defer tempFile.Close()

			if _, err = io.Copy(tempFile, src); err != nil {
				return c.JSON(http.StatusBadRequest, err)
			}

			data := tempFile.Name()

			c.Set("bookFile", data)
			return next(c)
		}

		c.Set("bookFile", "")
		return next(c)

	}
}
