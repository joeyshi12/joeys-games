import { Player } from "../../web/src/app/platformer/entities/player";

export class ArcadeService {
    private arcadeRepository: Map<string, Player>;

    constructor() {
        this.arcadeRepository = new Map();
    }

    public getPlayers(): Player[] {
        return Array.from(this.arcadeRepository.values());
    }

    public updatePlayer(socketId: string, player: Player): Player {
        this.arcadeRepository.set(socketId, player);
        return player;
    }

    public removePlayer(playerName: string): string {
        console.log(playerName);
        return playerName;
    }
}