import { PlayerMetadata } from "../../../../../src/transfers/playerMetadata";
import { Vector } from "../../../../../src/transfers/drawable";

export class ControlledPlayer {
  public static ACCELERATION = 0.8;
  public static GRAVITY = 0.4;
  public static MAX_SPEED = 4.2;
  public static ANIMATION_BUFFER = 6;
  public static JUMP_VELOCITY = 9.4;
  private _velocity: Vector = {x: 0, y: 0};
  private _acceleration: Vector = {x: 0, y: 0};

  constructor(private _metadata: PlayerMetadata) {
  }

  public get metadata(): PlayerMetadata {
    return this._metadata;
  }

  public keyPressed(key: string): void {
    switch (key.toLocaleUpperCase()) {
      case "W":
        if (this._metadata.position.y === 100) {
          this._velocity.y = -5;
          this._metadata.position.y--;
        }
        break;
      case "A":
        this._velocity.x = -5;
        break;
      case "S":
        break;
      case "D":
        this._velocity.x = 5;
        break;
      default:
    }
  }

  public keyReleased(key: string): void {
    switch (key.toLocaleUpperCase()) {
      case "A":
        if (this._velocity.x < 0) {
          this._velocity.x = 0;
        }
        break;
      case "D":
        if (this._velocity.x > 0) {
          this._velocity.x = 0;
        }
        break;
      default:
    }
  }

  public update(): void {
    if (this._metadata.position.y + this._velocity.y < 100) {
      this._metadata.position.y += this._velocity.y;
      this._acceleration.y = ControlledPlayer.GRAVITY;
    } else {
      this._metadata.position.y = 100;
      this._acceleration.y = 0;
    }
    this._metadata.position.x += this._velocity.x;
    this._velocity.x += this._acceleration.x;
    this._velocity.y += this._acceleration.y;
  }
}
