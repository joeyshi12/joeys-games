export interface Vector {
    x: number;
    y: number;
}

export interface CollisionBox {
    width: number;
    height: number;
    offset: Vector;
}

export interface Entity {
    position: Vector;
    spriteIndex: number;
    isFlipped: boolean;
    collisionBox: CollisionBox;
}

export enum PlayerState {
    falling = "falling",
    landed = "landed",
}

export interface PlayerMetadata extends Entity {
    userName: string;
    state: PlayerState;
}
