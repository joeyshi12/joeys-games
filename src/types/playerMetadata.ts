export type Vector = {
    x: number;
    y: number;
}

export type CollisionBox = {
    width: number;
    height: number;
    offset: Vector;
}

export type EntityMetadata = {
    position: Vector;
    spriteIndex: number;
    isFlipped: boolean;
    collisionBox: CollisionBox;
}

export enum PlayerState {
    STANDING,
    WALKING,
    FALLING,
    DEAD
}

export enum Character {
    BLUE,
    ORANGE,
    GREEN
}

export type PlayerMetadata = {
    name: string;
    character: Character;
} & EntityMetadata
