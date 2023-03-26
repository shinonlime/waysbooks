package handlers

import (
	"context"
	"fmt"
	"log"
	"net/http"
	"os"
	"strconv"
	"strings"
	bookdto "waysbook/dto/book"
	dto "waysbook/dto/result"
	"waysbook/models"
	"waysbook/repositories"

	"github.com/cloudinary/cloudinary-go"
	"github.com/cloudinary/cloudinary-go/api/uploader"
	"github.com/go-playground/validator"
	"github.com/labstack/echo/v4"
)

type handlerBook struct {
	BookRepository repositories.BookRepository
}

func HandlerBook(BookRepository repositories.BookRepository) *handlerBook {
	return &handlerBook{BookRepository}
}

func (h *handlerBook) GetBooks(c echo.Context) error {
	books, err := h.BookRepository.GetBooks()

	if err != nil {
		return c.JSON(http.StatusBadRequest, dto.ErrorResult{Code: http.StatusBadRequest, Message: err.Error()})
	}

	return c.JSON(http.StatusOK, dto.SuccessResult{Code: http.StatusOK, Data: books})
}

func (h *handlerBook) GetBooksBySold(c echo.Context) error {
	books, err := h.BookRepository.GetBooksBySold()

	if err != nil {
		return c.JSON(http.StatusBadRequest, dto.ErrorResult{Code: http.StatusBadRequest, Message: err.Error()})
	}

	return c.JSON(http.StatusOK, dto.SuccessResult{Code: http.StatusOK, Data: books})
}

func (h *handlerBook) FindBookById(c echo.Context) error {
	id, _ := strconv.Atoi(c.Param("id"))

	var book models.Book
	book, err := h.BookRepository.FindBook(id)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, dto.ErrorResult{Code: http.StatusBadRequest, Message: err.Error()})
	}

	return c.JSON(http.StatusOK, dto.SuccessResult{Code: http.StatusOK, Data: book})
}

func (h *handlerBook) CreateBook(c echo.Context) error {
	bookpath := c.Get("bookFile").(string)
	imagepath := c.Get("imageFile").(string)

	pages, _ := strconv.Atoi(c.FormValue("pages"))
	isbn, _ := strconv.Atoi(c.FormValue("isbn"))
	price, _ := strconv.Atoi(c.FormValue("price"))

	request := bookdto.AddBookRequest{
		Title:           c.FormValue("title"),
		PublicationDate: c.FormValue("publication_date"),
		Pages:           pages,
		ISBN:            isbn,
		Writer:          c.FormValue("writer"),
		Price:           price,
		Description:     c.FormValue("description"),
		BookAttachment:  bookpath,
		Thumbnail:       imagepath,
	}

	validation := validator.New()
	err := validation.Struct(request)
	if err != nil {
		return c.JSON(http.StatusBadRequest, dto.ErrorResult{Code: http.StatusBadRequest, Message: err.Error()})
	}

	var ctx = context.Background()
	var CLOUD_NAME = os.Getenv("CLOUD_NAME")
	var API_KEY = os.Getenv("API_KEY")
	var API_SECRET = os.Getenv("API_SECRET")

	// Add your Cloudinary credentials ...
	cld, _ := cloudinary.NewFromParams(CLOUD_NAME, API_KEY, API_SECRET)

	// Upload file to Cloudinary ...
	respBook, err := cld.Upload.Upload(ctx, bookpath, uploader.UploadParams{Folder: "waysbook/books"})
	if err != nil {
		fmt.Println(err.Error())
	}

	respImage, err := cld.Upload.Upload(ctx, imagepath, uploader.UploadParams{Folder: "waysbook/thumbnail"})
	if err != nil {
		fmt.Println(err.Error())
	}

	book := models.Book{
		Title:           request.Title,
		PublicationDate: request.PublicationDate,
		Pages:           request.Pages,
		ISBN:            request.ISBN,
		Writer:          request.Writer,
		Price:           request.Price,
		Description:     request.Description,
		BookAttachment:  respBook.SecureURL,
		Thumbnail:       respImage.SecureURL,
	}

	data, err := h.BookRepository.CreateBook(book)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, dto.ErrorResult{Code: http.StatusInternalServerError, Message: err.Error()})
	}

	return c.JSON(http.StatusOK, dto.SuccessResult{Code: http.StatusOK, Data: data})
}

func (h *handlerBook) UpdateBook(c echo.Context) error {
	bookpath := c.Get("bookFile").(string)
	imagepath := c.Get("imageFile").(string)

	pages, _ := strconv.Atoi(c.FormValue("pages"))
	isbn, _ := strconv.Atoi(c.FormValue("isbn"))
	price, _ := strconv.Atoi(c.FormValue("price"))
	sold, _ := strconv.Atoi(c.FormValue("sold"))

	request := bookdto.UpdateBookRequest{
		Title:           c.FormValue("title"),
		PublicationDate: c.FormValue("publication_date"),
		Pages:           pages,
		ISBN:            isbn,
		Writer:          c.FormValue("writer"),
		Price:           price,
		Description:     c.FormValue("description"),
		BookAttachment:  bookpath,
		Thumbnail:       imagepath,
		Sold:            sold,
	}

	id, _ := strconv.Atoi(c.Param("id"))

	book, err := h.BookRepository.FindBook(id)
	if err != nil {
		return c.JSON(http.StatusBadRequest, dto.ErrorResult{Code: http.StatusBadRequest, Message: err.Error()})
	}

	var ctx = context.Background()
	var CLOUD_NAME = os.Getenv("CLOUD_NAME")
	var API_KEY = os.Getenv("API_KEY")
	var API_SECRET = os.Getenv("API_SECRET")

	// Add your Cloudinary credentials ...
	cld, _ := cloudinary.NewFromParams(CLOUD_NAME, API_KEY, API_SECRET)

	urlPartsBook := strings.Split(book.BookAttachment, "/")
	publicIDBook := urlPartsBook[len(urlPartsBook)-1]
	publicIDBook = publicIDBook[:strings.Index(publicIDBook, ".")]

	urlPartsImage := strings.Split(book.Thumbnail, "/")
	publicIDImage := urlPartsImage[len(urlPartsImage)-1]
	publicIDImage = publicIDImage[:strings.Index(publicIDImage, ".")]

	// Upload file to Cloudinary ...
	respBook, err := cld.Upload.Upload(ctx, bookpath, uploader.UploadParams{Folder: "waysbook/books", PublicID: publicIDBook})
	if err != nil {
		fmt.Println(err.Error())
	}

	respImage, err := cld.Upload.Upload(ctx, imagepath, uploader.UploadParams{Folder: "waysbook/thumbnail", PublicID: publicIDImage})
	if err != nil {
		fmt.Println(err.Error())
	}

	if request.Title != "" {
		book.Title = request.Title
	}

	if request.PublicationDate != "" {
		book.PublicationDate = request.PublicationDate
	}

	if request.Pages != 0 {
		book.Pages = request.Pages
	}

	if request.ISBN != 0 {
		book.ISBN = request.ISBN
	}

	if request.Writer != "" {
		book.Writer = request.Writer
	}

	if request.Price != 0 {
		book.Price = request.Price
	}

	if request.Description != "" {
		book.Description = request.Description
	}

	if request.BookAttachment != "" {
		book.BookAttachment = respBook.SecureURL
	}

	if request.Thumbnail != "" {
		book.Thumbnail = respImage.SecureURL
	}

	if request.Sold != 0 {
		book.Sold = request.Sold
	}

	data, err := h.BookRepository.UpdateBook(book, id)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, dto.ErrorResult{Code: http.StatusInternalServerError, Message: err.Error()})
	}

	return c.JSON(http.StatusOK, dto.SuccessResult{Code: http.StatusOK, Data: data})
}

func (h *handlerBook) DeleteBook(c echo.Context) error {
	id, _ := strconv.Atoi(c.Param("id"))

	book, err := h.BookRepository.FindBook(id)
	if err != nil {
		return c.JSON(http.StatusBadRequest, dto.ErrorResult{Code: http.StatusBadRequest, Message: err.Error()})
	}

	if book.Thumbnail != "" {
		if err := os.Remove("uploads/" + book.Thumbnail); err != nil {
			log.Printf("error deleting image file: %v", err)
		}
	}

	if book.BookAttachment != "" {
		if err := os.Remove("uploads/" + book.BookAttachment); err != nil {
			log.Printf("error deleting book file: %v", err)
		}
	}

	data, err := h.BookRepository.DeleteBook(book)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, dto.ErrorResult{Code: http.StatusInternalServerError, Message: err.Error()})
	}

	return c.JSON(http.StatusOK, dto.SuccessResult{Code: http.StatusOK, Data: data})
}
