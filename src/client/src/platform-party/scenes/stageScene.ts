import { Scene } from "./scene";
import PlatformPartyManager from "../platformPartyManager";
import { PlayerMetadata } from "../../../../models/platformPartyModels";
import { Stage, StageMap } from "./stage";
import { Player } from "../entities/player";

export default class StageScene extends Scene {
    private readonly _stage: Stage;
    private _playerMetadata: PlayerMetadata[] = [];

    public constructor(manager: PlatformPartyManager, stageMap: StageMap, private _player: Player) {
        super(manager);
        this._stage = new Stage(stageMap);
        this.manager.socket.on("receivePlayer", (updatedPlayer: PlayerMetadata) => {
            const playerIndex = this._playerMetadata.findIndex(p => p.name === updatedPlayer.name);
            if (playerIndex === -1) {
                this._playerMetadata.push(updatedPlayer);
            } else {
                this._playerMetadata[playerIndex] = updatedPlayer;
            }
        });
    }

    public override keyPressed(event: KeyboardEvent) {
        this._player.keyPressed(event.key);
    }

    public override keyReleased(event: KeyboardEvent) {
        this._player.keyReleased(event.key);
    }

    public override update() {
        this._player.update(this._stage);
        if (this._player.isMoving) {
            this.manager.socket.emit("updatePlayer", this._player.metadata);
        }
        this.manager.renderer.updateCameraPosition(this._player.metadata.position, this._stage);
    }

    public override draw() {
        this.manager.renderer.drawStage(this._stage);
        for (const player of this._playerMetadata) {
            if (player.name !== this._player.metadata.name) {
                this.manager.renderer.drawPlayer(player);
            }
        }
        this.manager.renderer.drawPlayer(this._player.metadata);
    }
}
