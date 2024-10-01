export type Vector2D = {
    x: number;
    y: number;
};

export type CollisionBox = {
    width: number;
    height: number;
    offset: Vector2D;
};

export type EntityMetadata = {
    position: Vector2D;
    spriteIndex: number;
    isFlipped: boolean;
    collisionBox: CollisionBox;
};

export enum PlayerState {
    STANDING = 0,
    WALKING = 1,
    FALLING = 2,
    DEAD = 3
}

export enum Character {
    BLUE = 0,
    ORANGE = 1,
    GREEN = 2
}

export type PlayerMetadata = {
    name: string;
    character: Character;
} & EntityMetadata;

export type MapData = {
    name: string;
    rows: number;
    columns: number;
    spriteData: number[];
    solidIndices: number[];
    platformIndices: number[];
};
