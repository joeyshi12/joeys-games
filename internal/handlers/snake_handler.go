package handlers

import (
	"encoding/json"
	"log"
	"net/http"
	"strings"
	"time"
	_ "github.com/go-sql-driver/mysql"
	"play.joeyshi.xyz/server/internal/database"
)

type SnakeScore struct {
    Score           int     `json:"score"`
    PlayerName      string  `json:"playerName"`
    CreationDate    string  `json:"creationDate,omitempty"`
}

func HandleGetSnakeScores(w http.ResponseWriter, r *http.Request) { 
    scores, err := fetchSnakeScores()
    if err != nil {
        http.Error(w, "Error encountered while fetching snake scores", http.StatusInternalServerError)
        return
    }
    w.Header().Set("Content-Type", "application/json")
    json.NewEncoder(w).Encode(scores)
}

func HandlePutSnakeScore(w http.ResponseWriter, r *http.Request) {
    var score SnakeScore
    err := json.NewDecoder(r.Body).Decode(&score)
    if err != nil || score.Score < 0 || len(score.PlayerName) < 3 || len(score.PlayerName) > 8 {
        http.Error(w, "Invalid snake score", http.StatusBadRequest)
        return
    }
    score.CreationDate = strings.Split(time.Now().Format(time.RFC3339), "T")[0]
    err = insertScore(&score)
    if err != nil {
        http.Error(w, "Failed to insert snake score", http.StatusInternalServerError)
        return
    }
    w.Header().Set("Content-Type", "application/json")
    json.NewEncoder(w).Encode(score)
}

func fetchSnakeScores() ([]SnakeScore, error) {
    db, err := database.OpenGamesDatabase()
    if err != nil {
        log.Println("Error encountered when opening database connection")
        return nil, err
    }
    defer db.Close()

    rows, err := db.Query(`SELECT score, player_name AS playerName, DATE_FORMAT(creation_date, '%Y-%m-%d') AS creationDate FROM snake_score ORDER BY score DESC`)
    if err != nil {
        log.Printf("Error encountered when executing snake scores query: %v\n", err)
        return nil, err
    }
    defer rows.Close()

    var scores []SnakeScore
    for rows.Next() {
        var score SnakeScore
        err = rows.Scan(&score.Score, &score.PlayerName, &score.CreationDate)
        if err != nil {
            log.Printf("Error encountered when scanning snake score: %v\n", err)
            return nil, err
        }
        scores = append(scores, score)
    }

    err = rows.Err()
    if err != nil {
        log.Printf("Error encountered when reading all snake scores: %v\n", err)
        return nil, err
    }

    return scores, nil
}

func insertScore(score *SnakeScore) error {
    db, err := database.OpenGamesDatabase()
    if err != nil {
        log.Println("Error encountered when opening database connection")
        return err
    }
    defer db.Close()

    rows, err := db.Query(`INSERT INTO snake_score VALUES (?, ?, ?)`, score.PlayerName, score.Score, score.CreationDate)
    if err != nil {
        log.Printf("Error encountered when inserting snake score: %v\n", err)
        return err
    }
    defer rows.Close()

    log.Printf("Inserted snake score [player=%s] [score=%d]\n", score.PlayerName, score.Score)
    return nil
}
