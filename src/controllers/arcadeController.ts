import {ArcadeService} from "../services/arcadeService";
import {PlayerMetadata} from "../services/playerMetadata";

export class ArcadeController {
    constructor(private arcadeService: ArcadeService) {
        console.log("init services");
    }

    public joinLobby(username: string): void {
        this.arcadeService.createPlayer(username);
        console.log("user joined");
    }

    public updatePlayer(player: PlayerMetadata): void {
        this.arcadeService.updatePlayer(player)
        console.log("user updated");
    }

    public exitLobby(playerName: string): void {
        this.arcadeService.removePlayer(playerName);
        console.log("user disconnected");
    }
}