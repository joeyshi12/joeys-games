export interface Vector {
    x: number;
    y: number;
}

export interface CollisionBox {
    width: number;
    height: number;
    offset: Vector;
}

export interface EntityMetadata {
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

export interface PlayerMetadata extends EntityMetadata {
    name: string;
    character: Character;
}
