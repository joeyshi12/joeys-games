import {Scene} from "./scene";
import Game from "../game";
import {PlayerMetadata} from "../../../../src/models/platformPartyModels";
import { Stage, StageMap } from "./stage";

export default class StageScene extends Scene {
    private readonly _stage: Stage;
    private _playerMetadata: PlayerMetadata[] = [];

    public constructor(game: Game, stageMap: StageMap) {
        super(game);
        this._stage = new Stage(stageMap);
        this.game.socket.on("receivePlayer", (updatedPlayer: PlayerMetadata) => {
            const playerIndex = this._playerMetadata.findIndex(p => p.name === updatedPlayer.name);
            if (playerIndex === -1) {
                this._playerMetadata.push(updatedPlayer);
            } else {
                this._playerMetadata[playerIndex] = updatedPlayer;
            }
        });
    }

    public keyPressed(event: KeyboardEvent) {
        this.game.player.keyPressed(event.key);
    }

    public keyReleased(event: KeyboardEvent) {
        this.game.player.keyReleased(event.key);
    }

    public update() {
        this.game.player.update(this._stage);
        if (this.game.player.isMoving) {
            this.game.socket.emit("updatePlayer", this.game.player.metadata);
        }
        this.game.renderer.updateCameraPosition(this.game.player.metadata.position, this._stage);
        this.game.renderer.drawStage(this._stage);
        for (const player of this._playerMetadata) {
            if (player.name !== this.game.player.metadata.name) {
                this.game.renderer.drawPlayer(player);
            }
        }
        this.game.renderer.drawPlayer(this.game.player.metadata);
    }
}
