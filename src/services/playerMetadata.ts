interface Position {
    x: number;
    y: number;
}

export interface PlayerState {
    position: Position;
    animationIndex: number;
}

export interface PlayerMetadata {
    userName: string;
    state: PlayerState;
}
