package handlers

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"

	"github.com/coder/websocket"
	"github.com/coder/websocket/wsjson"
	"play.joeyshi.xyz/server/internal/models"
)

type PlatformerServer struct {
    conns map[*websocket.Conn]bool
    players map[*websocket.Conn]models.PlayerMetadata
}

func NewPlatformerServer() *PlatformerServer {
    return &PlatformerServer {
        conns: make(map[*websocket.Conn]bool),
    }
}

func (server *PlatformerServer) HandlePlatformerWS(w http.ResponseWriter, r *http.Request) {
    conn, err := websocket.Accept(w, r, nil)
	if err != nil {
        return
	}
    server.conns[conn] = true
    defer conn.CloseNow()
    ctx := r.Context()
    for {
        _, message, err := conn.Read(ctx)
        if err != nil {
            log.Printf("Error encountered while reading from socket: %v", err)
            break
        }
        err = server.handlePlatformerWSEvent(conn, ctx, message)
        if err != nil {
            log.Printf("Error encountered while writing to socket: %v", err)
            break
        }
    }
    delete(server.conns, conn)
    delete(server.players, conn)
}

func HandleGetPlatformerMaps(w http.ResponseWriter, r *http.Request) {
    file, err := os.Open("data/default.json")
    if err != nil {
        log.Printf("Error encountered when reading default map: %v\n", err)
        http.Error(w, "Failed to find maps", http.StatusInternalServerError)
        return
    }
    var maps []models.MapData
    var mapData models.MapData
    json.NewDecoder(file).Decode(&mapData)
    maps = append(maps, mapData)
    w.Header().Set("Content-Type", "application/json")
    json.NewEncoder(w).Encode(maps)
}

func (server *PlatformerServer) handlePlatformerWSEvent(
    conn *websocket.Conn,
    ctx context.Context,
    message []byte) error {
    eventTypeEndOffset := findByte(0, message)
    if eventTypeEndOffset <= 0 {
        return fmt.Errorf("Error encountered while reading event type from message: %s", message)
    }

    eventType := string(message[:eventTypeEndOffset])
    log.Printf("Received event type: %s", eventType)

    switch (eventType) {
    case "login":
        playerName := string(message[eventTypeEndOffset + 1:])
        wsjson.Write(ctx, conn, newPlayerMetadata(playerName))
        log.Printf("Created player: %s", playerName)
    case "playerUpdate":
        var player models.PlayerMetadata
        err := json.Unmarshal(message[eventTypeEndOffset + 1:], &player)
        if err != nil {
            log.Printf("Error encountered while reading player")
        }
        for c := range server.conns {
            if c != conn {
                wsjson.Write(ctx, c, player)
            }
        }
    default:
        log.Printf("Received invalid event type: %s", eventType)
        return fmt.Errorf("Invalid event type received: %s", eventType)
    }

    return nil
}

func newPlayerMetadata(name string) *models.PlayerMetadata {
    return &models.PlayerMetadata {
        Name: name,
        CharacterType: 0,
        Position: models.Vector {
            X: 80.,
            Y: 500.,
        },
        SpriteIndex: 354,
        IsFlipped: false,
        CollisionBox: models.CollisionBox {
            Width: 16,
            Height: 16,
            Offset: models.Vector {
                X: 0.0,
                Y: 0.0,
            },
        },
    }
}

func findByte(val byte, arr []byte) int {
    for i, b := range arr {
		if b == val {
			return i
		}
	}
	return -1
}
