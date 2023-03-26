package middleware

import (
	"io"
	"io/ioutil"
	"net/http"

	"github.com/labstack/echo/v4"
)

func UploadImage(next echo.HandlerFunc) echo.HandlerFunc {
	return func(c echo.Context) error {
		fileImage, err := c.FormFile("image")

		if fileImage != nil {
			if err != nil {
				return c.JSON(http.StatusBadRequest, err)
			}

			src, err := fileImage.Open()
			if err != nil {
				return c.JSON(http.StatusBadRequest, err)
			}
			defer src.Close()

			tempFile, err := ioutil.TempFile("uploads", "image-*.png")
			if err != nil {
				return c.JSON(http.StatusBadRequest, err)
			}
			defer tempFile.Close()

			if _, err = io.Copy(tempFile, src); err != nil {
				return c.JSON(http.StatusBadRequest, err)
			}

			data := tempFile.Name()

			c.Set("imageFile", data)
			return next(c)
		}

		c.Set("imageFile", "")
		return next(c)
	}
}
