package cartdto

type CartRequest struct {
	UserID int `json:"user_id" form:"user_id"`
	BookID int `json:"book_id" form:"book_id"`
}
