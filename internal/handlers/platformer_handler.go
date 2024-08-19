package handlers

import (
	"context"
	"encoding/json"
	"log"
	"net/http"
	"os"
	"time"
	"github.com/coder/websocket"
)

type platformerServer struct {
    serveMux http.ServeMux
}

type collisionBox struct {
    Width       int     `json:"width"`
    Height      int     `json:"height"`
    OffsetX     int     `json:"offsetX"`
    OffsetY     int     `json:"offsetY"`
}

type playerMetadata struct {
    Name            string          `json:"name"`
    CharacterType   int             `json:"characterType"`
    PositionX       int             `json:"positionX"`
    PositionY       int             `json:"positionY"`
    SpriteIndex     int             `json:"spriteIndex"`
    IsFlipped       bool            `json:"isFlipped"`
    CollisionBox    collisionBox    `json:"collisionBox"`
}

type platformerMessage[T any] struct {
    Type string
    Body T
}

type mapData struct {
    Name            string  `json:"name"`
    Rows            int     `json:"rows"`
    Columns         int     `json:"columns"`
    SpriteData      []int   `json:"spriteData"`
    SolidIndices    []int   `json:"solidIndices"`
    PlatformIndices []int   `json:"platformIndices"`
}

func newPlatformerServer() *platformerServer {
    ps := &platformerServer {}
    ps.serveMux.HandleFunc("/platformer", ps.handleSubscribe)
    return ps
}

func (server *platformerServer) handleSubscribe(w http.ResponseWriter, r *http.Request) {

}

func (server *platformerServer) ServeHTTP(w http.ResponseWriter, r *http.Request) {
    c, err := websocket.Accept(w, r, nil)
    if err != nil {
        log.Printf("Failed: %v\n", err)
        return
    }
    defer c.CloseNow()

    ctx, cancel := context.WithTimeout(r.Context(), time.Second * 10)
    defer cancel()

    //var v interface{}
    //err = wsjson.Read(ctx, c, &v)
    //if err != nil {
    //    log.Printf("Failed2\n")
    //    return
    //}
    //log.Printf("Received: %v", v)

    messageType, _, err := c.Reader(ctx)
    if err != nil {
        log.Println(err)
        return
    }

    writer, err := c.Writer(ctx, messageType)
    if err != nil {
        log.Println(err)
        return
    }

    writer.Write([]byte("SEE MEEE NOWWWWWW"))
}


func HandleGetPlatformerMaps(w http.ResponseWriter, r *http.Request) {
    file, err := os.Open("data/default.json")
    if err != nil {
        log.Printf("Error encountered when reading default map: %v\n", err)
    }
    var maps []mapData
    var mapData mapData
    json.NewDecoder(file).Decode(&mapData)
    maps = append(maps, mapData)
    w.Header().Set("Content-Type", "application/json")
    json.NewEncoder(w).Encode(maps)
}
