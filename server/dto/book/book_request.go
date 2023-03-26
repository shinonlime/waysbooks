package bookdto

type AddBookRequest struct {
	Title           string `json:"title" form:"title" validate:"required"`
	PublicationDate string `json:"publication_date" form:"publication_date" validate:"required"`
	Pages           int    `json:"pages" form:"pages" validate:"required"`
	ISBN            int    `json:"isbn" form:"isbn" validate:"required"`
	Writer          string `json:"writer" form:"writer" validate:"required"`
	Price           int    `json:"price" form:"price" validate:"required"`
	Description     string `json:"description" form:"description" validate:"required"`
	BookAttachment  string `json:"book_attachment" form:"book_attachment" validate:"required"`
	Thumbnail       string `json:"thumbnail" form:"image" validate:"required"`
}

type UpdateBookRequest struct {
	Title           string `json:"title" form:"title"`
	PublicationDate string `json:"publication_date" form:"publication_date"`
	Pages           int    `json:"pages" form:"pages"`
	ISBN            int    `json:"isbn" form:"isbn"`
	Writer          string `json:"writer" form:"writer"`
	Price           int    `json:"price" form:"price"`
	Description     string `json:"description" form:"description"`
	BookAttachment  string `json:"book_attachment" form:"book_attachment"`
	Thumbnail       string `json:"thumbnail" form:"image"`
	Sold            int    `json:"sold" form:"sold"`
}
