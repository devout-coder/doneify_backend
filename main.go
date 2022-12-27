package main

import (
	"fmt"
	"log"
	"net/http"

	"github.com/devout-coder/doneify_backend/router"
)

func main() {
	r := router.Router()
	fmt.Println("server started")

	//listen to a port
	port := "4000"
	log.Fatal(http.ListenAndServe(":"+port, r))

}
