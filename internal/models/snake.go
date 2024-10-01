package models

type SnakeScore struct {
    Score           int     `json:"score"`
    PlayerName      string  `json:"playerName"`
    CreationDate    string  `json:"creationDate,omitempty"`
}
