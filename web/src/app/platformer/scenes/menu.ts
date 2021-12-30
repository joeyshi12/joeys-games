import * as p5 from "p5";
import { Character } from "../../../../../src/types/entityMetadata";
import { PlatformerSketch } from "../platformerSketch";
import { Scene } from "./scene";
import { Button } from "./button";
import { Lobby } from "./lobby";

export class Menu extends Scene {
  private _buttons: Button[];

  constructor(sketch: PlatformerSketch) {
    super(sketch);
    this._buttons = [
      new Button("Start", {x: 100, y: 100}, () => {
        this._sketch.playerDataService.initControlledPlayer(
          "bruh" + Math.random().toLocaleString(),
          Character.orange,
          (isInitialized: boolean) => {
            if (isInitialized) {
              this._sketch.scene = new Lobby(sketch);
            }
          },
          (msg: string) => {
            console.log(msg);
          }
        );
      })
    ];
  }

  public override mouseClicked(context: p5): void {
    for (const button of this._buttons) {
      if (button.isHovered(context.mouseX, context.mouseY)) {
        button.callback();
        return;
      }
    }
  }

  public draw(context: p5): void {
    for (const button of this._buttons) {
      this._sketch.rendererService.renderButton(context, button);
    }
  }
}
