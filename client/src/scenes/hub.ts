import {Scene} from "./scene";
import Game from "../game";
import {PlayerMetadata} from "../../../src/types/entityMetadata";
import {StageService} from "../stageService";

export default class Hub extends Scene {
    private _stageService: StageService;
    private _playerMetadata: PlayerMetadata[] = [];

    public constructor(game: Game) {
        super(game);
        this._stageService = new StageService();
        this.game.socket.on("receivePlayers", (players: PlayerMetadata[]) => {
            this._playerMetadata = players;
        });
    }

    public keyPressed(event: KeyboardEvent) {
        this.game.controlledPlayer.keyPressed(event.key, this.game.soundPlayer);
    }

    public keyReleased(event: KeyboardEvent) {
        this.game.controlledPlayer.keyReleased(event.key);
    }

    public update() {
        this.game.controlledPlayer.update(this._stageService.currentStage, this.game.soundPlayer);
        this.game.socket.emit("updatePlayer", this.game.controlledPlayer.metadata);
        this.game.renderer.updateCameraPosition(this.game.controlledPlayer.metadata.position, this._stageService.currentStage);
        this.game.renderer.drawStage(this._stageService.currentStage);
        for (const player of this._playerMetadata) {
            if (player.name !== this.game.controlledPlayer.metadata.name) {
                this.game.renderer.drawPlayer(player);
            }
        }
        this.game.renderer.drawPlayer(this.game.controlledPlayer.metadata);
    }
}