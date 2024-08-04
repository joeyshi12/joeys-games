export type Vector = {
    x: number;
    y: number;
};

export type CollisionBox = {
    width: number;
    height: number;
    offset: Vector;
};

export type EntityMetadata = {
    position: Vector;
    spriteIndex: number;
    isFlipped: boolean;
    collisionBox: CollisionBox;
};

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
} & EntityMetadata;

export type MapData = {
    name: string;
    rows: number;
    columns: number;
    spriteData: number[];
    solidIndices: number[];
    platformIndices: number[];
};

export class MapError extends Error {
    public constructor(msg: string) {
        super(msg);
    }
}
