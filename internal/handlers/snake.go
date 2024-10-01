package handlers

import (
	"encoding/json"
	"net/http"
	"strings"
	"time"

	_ "github.com/go-sql-driver/mysql"
	"play.joeyshi.xyz/server/internal/database"
	"play.joeyshi.xyz/server/internal/models"
)

func NewSnakeHandler() http.Handler {
    mux := http.NewServeMux()
    mux.Handle("/", IndexPageHandler("templates/snake.html"))
    mux.HandleFunc("GET /scores", getSnakeScores)
    mux.HandleFunc("PUT /scores", putSnakeScore)
    return mux
}

func getSnakeScores(w http.ResponseWriter, r *http.Request) { 
    scores, err := database.GetSnakeScores()
    if err != nil {
        http.Error(w, "Error encountered while fetching snake scores", http.StatusInternalServerError)
        return
    }
    w.Header().Set("Content-Type", "application/json")
    json.NewEncoder(w).Encode(scores)
}

func putSnakeScore(w http.ResponseWriter, r *http.Request) {
    var score models.SnakeScore
    err := json.NewDecoder(r.Body).Decode(&score)
    if err != nil || score.Score < 0 || len(score.PlayerName) < 3 || len(score.PlayerName) > 8 {
        http.Error(w, "Invalid snake score", http.StatusBadRequest)
        return
    }
    score.CreationDate = strings.Split(time.Now().Format(time.RFC3339), "T")[0]
    err = database.InsertScore(&score)
    if err != nil {
        http.Error(w, "Failed to insert snake score", http.StatusInternalServerError)
        return
    }
    w.Header().Set("Content-Type", "application/json")
    json.NewEncoder(w).Encode(score)
}

