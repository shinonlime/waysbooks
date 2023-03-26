package bookpurchasesdto

type BookPurchasesRequest struct {
	BookID          int    `json:"book_id" form:"book_id"`
	Title           string `json:"title" form:"title"`
	PublicationDate string `json:"publication_date" form:"publication_date"`
	Pages           int    `json:"pages" form:"pages"`
	ISBN            int    `json:"isbn" form:"isbn"`
	Writer          string `json:"writer" form:"writer"`
	Price           int    `json:"price" form:"price"`
	Description     string `json:"description" form:"description"`
	BookAttachment  string `json:"book_attachment" form:"book_attachment"`
	Thumbnail       string `json:"thumbnail" form:"thumbnail"`
}
