import {ArcadeService} from "../services/arcadeService";
import Log from "../util/logger";
import { Player } from "../../web/src/app/platformer/entities/player";

export class ArcadeController {
    constructor(private arcadeService: ArcadeService) {}

    public getPlayers(): Player[] {
        return this.arcadeService.getPlayers();
    }

    public updatePlayer(socketId: string, player: Player): Player {
        return this.arcadeService.updatePlayer(socketId, player);
    }

    public exitLobby(socketId: string): void {
        this.arcadeService.removePlayer(socketId);
        Log.info(`Socket [${socketId}] has disconnected`);
    }
}