import { Scene } from "./scene";
import * as p5 from "p5";
import { PlayerState } from "../../../../../src/transfers/playerMetadata";
import { PlatformerSketch } from "../platformerSketch";
import { ControlledPlayer } from "../entities/controlledPlayer";

export class Lobby extends Scene {
  private readonly _player: ControlledPlayer;

  constructor(sketch: PlatformerSketch) {
    super(sketch);
    this._player = new ControlledPlayer({
      userName: Math.random().toString(),
      state: PlayerState.walking,
      position: { x: 100, y: 100 },
      spriteIndex: 100,
      isFlipped: false
    });
  }

  public override keyPressed(context: p5): void {
    this._player.keyPressed(context.key);
    this._sketch.arcadeDataService.updatePlayer(this._player.metadata);
  }

  public override keyReleased(context: p5): void {
    this._player.keyReleased(context.key);
    this._sketch.arcadeDataService.updatePlayer(this._player.metadata);
  }

  public draw(context: p5): void {
    this._player.update();
    this._sketch.arcadeDataService.updatePlayer(this._player.metadata);
    this._sketch.rendererService.renderStage(context);
    this._sketch.arcadeDataService.players?.forEach((x) => {
      this._sketch.rendererService.renderDrawable(context, x);
    })
  }
}
