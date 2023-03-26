package transactiondto

type AddTransactionRequest struct {
	ID     int    `json:"id"`
	Name   string `json:"name" form:"name"`
	Email  string `json:"email" form:"email"`
	Status string `json:"status"`
	Total  int    `json:"total" form:"total"`
	UserID int    `json:"user_id"`
}
