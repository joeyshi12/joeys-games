import {Scene} from "./scene";
import * as p5 from "p5";
import {Player} from "../entities/player";
import {PlatformerSketch} from "../platformerSketch";

export class Lobby extends Scene {
  private readonly _player: Player;

  constructor(sketch: PlatformerSketch) {
    super(sketch);
    this._player = new Player();
  }

  public override keyPressed(context: p5) {
    if (context.key === 'a') {
      this._player.position.x -= 5;
    } else if (context.key === 'd') {
      this._player.position.x += 5;
    }
  }

  public draw(context: p5): void {
    this._sketch.rendererService.renderStage(context);
    this._sketch.rendererService.renderDrawable(context, this._player);
  }
}
