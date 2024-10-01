package main

import (
	"fmt"
	"log"
	"net/http"
	"os"

	"play.joeyshi.xyz/server/internal/handlers"
)

func main() {
    addr := fmt.Sprintf(":%s", os.Getenv("PORT"))
    mux := http.NewServeMux()

    mux.Handle("/", handlers.IndexPageHandler("templates/index.html"))
    fileServerHandler := http.FileServer(http.Dir("./static"))
    mux.Handle("/static/", http.StripPrefix("/static/", fileServerHandler))

    snakeHandler := handlers.NewSnakeHandler()
    mux.Handle("/snake/", http.StripPrefix("/snake", snakeHandler))

    platformPartyHandler := handlers.NewPlatformPartyHandler()
    mux.Handle("/platform-party/", http.StripPrefix("/platform-party", platformPartyHandler))

    log.Printf("Listening on address %s\n", addr)
    log.Fatal(http.ListenAndServe(addr, handlers.LoggingHandler(mux)))
}
