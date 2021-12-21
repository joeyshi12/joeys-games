export interface PlayerState {
    position: [number, number];
    animationIndex: number;
}

export interface PlayerMetadata {
    displayName: string;
    username: string;
    state: PlayerState;
}
