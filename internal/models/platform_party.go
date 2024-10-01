package models

type Vector struct {
    X   float32     `json:"x"`
    Y   float32     `json:"y"`
}

type CollisionBox struct {
    Width   int     `json:"width"`
    Height  int     `json:"height"`
    Offset  Vector  `json:"offset"`
}

type PlayerMetadata struct {
    Name            string          `json:"name"`
    CharacterType   int             `json:"characterType"`
    Position        Vector          `json:"position"`
    SpriteIndex     int             `json:"spriteIndex"`
    IsFlipped       bool            `json:"isFlipped"`
    CollisionBox    CollisionBox    `json:"collisionBox"`
}

type MapData struct {
    Name            string  `json:"name"`
    Rows            int     `json:"rows"`
    Columns         int     `json:"columns"`
    SpriteData      []int   `json:"spriteData"`
    SolidIndices    []int   `json:"solidIndices"`
    PlatformIndices []int   `json:"platformIndices"`
}
