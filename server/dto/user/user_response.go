package userdto

type UserResponse struct {
	ID      int    `json:"id"`
	Name    string `json:"name"`
	Email   string `json:"email"`
	Gender  string `json:"gender"`
	Phone   string `json:"phone"`
	Address string `json:"address"`
	Image   string `json:"avatar"`
}

type LoginResponse struct {
	Name     string `json:"name"`
	IsAdmin  bool   `json:"is_admin"`
	Email    string `json:"email"`
	Password string `json:"-"`
	Token    string `json:"token"`
}

type RegisterResponse struct {
	Name     string `json:"name"`
	IsAdmin  bool   `json:"is_admin"`
	Email    string `json:"email"`
	Password string `json:"-"`
}
