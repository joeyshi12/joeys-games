import * as p5 from "p5";
import { Character, PlayerMetadata } from "../../../../../src/types/entityMetadata";
import { PlatformerSketch } from "../platformerSketch";
import { Scene } from "./scene";
import { Button } from "./button";
import { Lobby } from "./lobby";

export class Menu extends Scene {
  private readonly _buttons: Button[];

  constructor(sketch: PlatformerSketch) {
    super(sketch);
    this._buttons = [
      new Button("Start", {x: 100, y: 100}, () => {
        const metadata = this._buildInitialPlayerMetadata();
        this._sketch.playerDataService.createPlayer(metadata).subscribe(() => {
          this._sketch.scene = new Lobby(sketch);
        });
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

  private _buildInitialPlayerMetadata(): PlayerMetadata {
    return {
      userName: "bruh" + Math.random().toLocaleString(),
      character: Character.blue,
      position: {x: 100, y: 100},
      spriteIndex: 356,
      isFlipped: false,
      collisionBox: {
        width: 30,
        height: 30,
        offset: {x: 0, y: 6}
      }
    };
  }
}
