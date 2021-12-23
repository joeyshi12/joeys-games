import {ArcadeService} from "../services/arcadeService";
import Log from "../util/logger";
import { PlayerMetadata } from "../transfers/playerMetadata";

export class ArcadeController {
    constructor(private arcadeService: ArcadeService) {}

    public getPlayers(): PlayerMetadata[] {
        return this.arcadeService.getPlayers();
    }

    public updatePlayer(socketId: string, player: PlayerMetadata): PlayerMetadata {
        return this.arcadeService.updatePlayer(socketId, player);
    }

    public exitLobby(socketId: string): void {
        this.arcadeService.removePlayer(socketId);
        Log.info(`Socket [${socketId}] has disconnected`);
    }
}