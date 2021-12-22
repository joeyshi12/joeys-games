import {Drawable, Position} from "./drawable";

export class Player implements Drawable {
  public readonly isFlipped: boolean = false
  public readonly position: Position = { x: 100, y: 100 }
  public readonly spriteIndex: number = 50
}
