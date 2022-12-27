package router

import (
	controller "github.com/devout-coder/doneify_backend/controllers"
	"github.com/gorilla/mux"
)

func Router() *mux.Router {
	mainRouter := mux.NewRouter()
	authRouter := mainRouter.PathPrefix("/auth").Subrouter()
	authRouter.HandleFunc("/signup", controller.SignupHandler)

	// The Signin will send the JWT back as we are making microservices.
	// The JWT token will make sure that other services are protected.
	// So, ultimately, we would need a middleware
	authRouter.HandleFunc("/signin", controller.SigninHandler)

	// Add time outs
	// server := &http.Server{
	// 	Addr:    "127.0.0.1:9090",
	// 	Handler: mainRouter,
	// }
	// err := server.ListenAndServe()
	// if err != nil {
	// fmt.Println("Error Booting the Server")
	// }
	return mainRouter
}
