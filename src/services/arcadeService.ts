import {PlayerMetadata, PlayerState} from "./playerMetadata";

export class ArcadeService {
    private arcadeRepository: Map<string, PlayerMetadata>;

    constructor() {
        this.arcadeRepository = new Map();
    }

    createPlayer(playerName: string): PlayerMetadata {
        console.log(playerName);
        return undefined;
    }

    updatePlayer(player: PlayerMetadata): void {
        console.log(player);
    }

    removePlayer(playerName: string): string {
        console.log(playerName);
        return playerName;
    }
}