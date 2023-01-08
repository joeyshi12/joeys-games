import {Scene} from "./scene";
import Game from "../game";
import {PlayerMetadata} from "../../../src/types/playerMetadata";
import { Stage, StageMap } from "./stage";

export default class StageScene extends Scene {
    private readonly _stage: Stage;
    private _playerMetadata: PlayerMetadata[] = [];

    public constructor(game: Game, stageMap: StageMap) {
        super(game);
        this._stage = new Stage(stageMap);
        this.game.socket.on("receivePlayers", (players: PlayerMetadata[]) => {
            this._playerMetadata = players;
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
        this.game.socket.emit("update", this.game.player.metadata);
        this.game.renderer.updateCameraPosition(this.game.player.metadata.position, this._stage);
        this.game.renderer.drawStage(this._stage.mapData);
        for (const player of this._playerMetadata) {
            if (player.name !== this.game.player.metadata.name) {
                this.game.renderer.drawPlayer(player);
            }
        }
        this.game.renderer.drawPlayer(this.game.player.metadata);
    }
}
