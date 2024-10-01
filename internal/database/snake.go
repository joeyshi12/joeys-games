package database

import (
	"log"
	_ "github.com/go-sql-driver/mysql"
	"play.joeyshi.xyz/server/internal/models"
)

func GetSnakeScores() ([]models.SnakeScore, error) {
    db, err := openGamesDatabase()
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

    scores := []models.SnakeScore{}
    for rows.Next() {
        var score models.SnakeScore
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

func InsertScore(score *models.SnakeScore) error {
    db, err := openGamesDatabase()
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
