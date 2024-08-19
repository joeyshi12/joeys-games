package main

import (
	"context"
	"fmt"
	"log"
	"net/http"
	"os"
	"time"

	"github.com/coder/websocket"
	"play.joeyshi.xyz/server/internal/handlers"
)

func main() {
    port := os.Getenv("PORT")
    addr := fmt.Sprintf(":%s", port)

    http.Handle("/", http.FileServer(http.Dir("./static")))
    http.HandleFunc("GET /snake/scores", handlers.HandleGetSnakeScores)
    http.HandleFunc("PUT /snake/scores", handlers.HandlePutSnakeScore)

    server := &PlatformerServer{}
    http.Handle("/platformer/ws", server)
    http.HandleFunc("GET /platformer/maps", handlers.HandleGetPlatformerMaps)

    log.Printf("Listening on address %s\n", addr)
    log.Fatal(http.ListenAndServe(addr, nil))
}
