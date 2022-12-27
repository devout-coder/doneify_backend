package model

type User struct {
	Email        string
	Username     string
	Passwordhash string
	Role         int
}

func (user User) ValidatePasswordHash(pswdhash string) bool {
	return user.Passwordhash == pswdhash
}
