import { Scene } from "./scene";
import PlatformPartyManager from "../platformPartyManager";
import { PlayerMetadata } from "../../../../models/platformPartyModels";
import { Stage, StageMap } from "./stage";
import { Player } from "../entities/player";
import { SPRITE_LENGTH } from "../loadAssets";

export default class StageScene extends Scene {
    private readonly _stage: Stage;
    private _scale: number = 2;
    private _otherPlayers: PlayerMetadata[] = [];

    public constructor(manager: PlatformPartyManager, stageMap: StageMap, private _player: Player) {
        super(manager);
        this._stage = new Stage(manager.ctx, stageMap, manager.spriteSheet);
        this.manager.socket.on("receivePlayer", (player: PlayerMetadata) => {
            if (player.name === this._player.metadata.name) {
                return;
            }
            const playerIndex = this._otherPlayers.findIndex(p => p.name === player.name);
            if (playerIndex === -1) {
                this._otherPlayers.push(player);
            } else {
                this._otherPlayers[playerIndex] = player;
            }
        });
        this.manager.socket.on("receivePlayers", (players: PlayerMetadata[]) => {
            this._otherPlayers = players.filter(player => player.name !== this._player.metadata.name);
        });
    }

    public override keyDown(event: KeyboardEvent) {
        this._player.keyPressed(event.key);
    }

    public override keyUp(event: KeyboardEvent) {
        this._player.keyReleased(event.key);
    }

    public override update() {
        const prevPosX = this._player.metadata.position?.x;
        const prevPosY = this._player.metadata.position?.y;
        const prevSpriteIndex = this._player.metadata.spriteIndex;
        this._player.update(this._stage);

        const {position: updatedPosition, spriteIndex: updatedSpriteIndex} = this._player.metadata
        if (prevPosX !== updatedPosition?.x || prevPosY !== updatedPosition?.y || prevSpriteIndex !== updatedSpriteIndex) {
            this.manager.socket.emit("updatePlayer", this._player.metadata);
        }
    }

    public override draw() {
        const ctx = this.manager.ctx;
        ctx.save();
        ctx.fillStyle = "#1C1C1C";
        ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

        let translateX = ctx.canvas.width / 2 - this._player.metadata.position.x * this._scale;
        let translateY = ctx.canvas.height / 2 - this._player.metadata.position.y * this._scale;
        translateX = Math.max(Math.min(translateX, 0), ctx.canvas.width - this._stage.width * this._scale);
        translateY = Math.max(Math.min(translateY, 0), ctx.canvas.height - this._stage.height * this._scale);
        ctx.setTransform(this._scale, 0, 0, this._scale, translateX, translateY);

        this._stage.draw();
        for (const player of this._otherPlayers) {
            this._drawPlayer(ctx, player);
        }
        this._drawPlayer(ctx, this._player.metadata);
        ctx.restore();
    }

    private _drawPlayer(ctx: CanvasRenderingContext2D, entity: PlayerMetadata) {
        ctx.save();
        ctx.fillStyle = "#ffffff";
        ctx.font = "8px \"Inconsolata\"";
        const textWidth = ctx.measureText(entity.name).width;
        ctx.fillText(
            entity.name,
            entity.position.x - (textWidth - SPRITE_LENGTH) / 2,
            entity.position.y
        );
        if (entity.isFlipped) {
            ctx.translate(2 * entity.position.x + SPRITE_LENGTH, 0);
            ctx.scale(-1, 1);
        }
        ctx.drawImage(
            this.manager.spriteSheet.sprites[entity.spriteIndex],
            entity.position.x,
            entity.position.y,
        );
        ctx.restore();
    }
}
