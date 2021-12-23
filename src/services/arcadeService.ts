import { PlayerMetadata } from "../transfers/playerMetadata";

export class ArcadeService {
    private arcadeRepository: Map<string, PlayerMetadata>;

    constructor() {
        this.arcadeRepository = new Map();
    }

    public getPlayers(): PlayerMetadata[] {
        return Array.from(this.arcadeRepository.values());
    }

    public updatePlayer(socketId: string, player: PlayerMetadata): PlayerMetadata {
        this.arcadeRepository.set(socketId, player);
        return player;
    }

    public removePlayer(playerName: string): string {
        console.log(playerName);
        return playerName;
    }
}