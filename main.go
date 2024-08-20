package main

import (
	"fmt"
	"log"
	"net/http"
	"os"

	"play.joeyshi.xyz/server/internal/handlers"
)

func main() {
    port := os.Getenv("PORT")
    addr := fmt.Sprintf(":%s", port)
    platformerServer := handlers.NewPlatformerServer()

    http.Handle("/", http.FileServer(http.Dir("./static")))
    http.HandleFunc("GET /snake/scores", handlers.HandleGetSnakeScores)
    http.HandleFunc("PUT /snake/scores", handlers.HandlePutSnakeScore)
    http.HandleFunc("/platformer/ws", platformerServer.HandlePlatformerWS)
    http.HandleFunc("GET /platformer/maps", handlers.HandleGetPlatformerMaps)

    log.Printf("Listening on address %s\n", addr)
    log.Fatal(http.ListenAndServe(addr, nil))
}
