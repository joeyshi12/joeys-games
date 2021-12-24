import { Scene } from "./scene";
import * as p5 from "p5";
import { PlatformerSketch } from "../platformerSketch";
import { ControlledPlayer } from "../entities/controlledPlayer";
import { lobbyStage } from "../stages/stage";

export class Lobby extends Scene {
  constructor(sketch: PlatformerSketch) {
    super(sketch);
    this._sketch.playerDataService.joinLobby();
  }

  public get controlledPlayer(): ControlledPlayer {
    return this._sketch.playerDataService.controlledPlayer;
  }

  public override keyPressed(context: p5): void {
    if (this.controlledPlayer) {
      this.controlledPlayer.keyPressed(context.key);
      this._sketch.playerDataService.updatePlayer(this.controlledPlayer.metadata);
    }
  }

  public override keyReleased(context: p5): void {
    if (this.controlledPlayer) {
      this.controlledPlayer.keyReleased(context.key);
      this._sketch.playerDataService.updatePlayer(this.controlledPlayer.metadata);
    }
  }

  public draw(context: p5): void {
    if (this.controlledPlayer) {
      this.controlledPlayer.update();
      this._sketch.playerDataService.updatePlayer(this.controlledPlayer.metadata);
    }
    this._sketch.rendererService.renderStage(context, lobbyStage);
    for (const player of this._sketch.playerDataService.players) {
      if (this.controlledPlayer?.metadata.userName !== player.userName) {
        this._sketch.rendererService.renderEntity(context, player);
        this._sketch.rendererService.renderEntityCollisionBox(context, player);
      }
    }
    if (this.controlledPlayer) {
      this._sketch.rendererService.renderEntity(context, this.controlledPlayer.metadata);
      this._sketch.rendererService.renderEntityCollisionBox(context, this.controlledPlayer.metadata);
    }
  }
}
