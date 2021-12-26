import { PlayerMetadata, PlayerState, Vector } from "../../../../../src/transfers/entity";
import { Stage } from "../scenes/stage";

export class ControlledPlayer {
  public static ACCELERATION: number = 2.2;
  public static GRAVITY: number = 0.6;
  public static MAX_SPEED: number = 5.6;
  public static ANIMATION_BUFFER: number = 6;
  public static JUMP_VELOCITY: number = 12;
  public static FRICTION: number = 0.7;
  private _animationTimer: number = ControlledPlayer.ANIMATION_BUFFER;
  private _velocity: Vector = { x: 0, y: 0 };
  private _acceleration: Vector = { x: 0, y: 0 };

  constructor(private _metadata: PlayerMetadata) {
  }

  public get metadata(): PlayerMetadata {
    return this._metadata;
  }

  public keyPressed(key: string): void {
    switch (key.toLocaleUpperCase()) {
      case "W":
        if (this._metadata.state === PlayerState.landed) {
          this._metadata.position.y--;
          this._velocity.y = -ControlledPlayer.JUMP_VELOCITY;
          this._metadata.state = PlayerState.falling
        }
        break;
      case "A":
        this._acceleration.x = -ControlledPlayer.ACCELERATION;
        break;
      case "D":
        this._acceleration.x = ControlledPlayer.ACCELERATION;
        break;
      default:
    }
  }

  public keyReleased(key: string): void {
    switch (key.toLocaleUpperCase()) {
      case "A":
        if (this._acceleration.x < 0) {
          this._acceleration.x = 0;
        }
        break;
      case "D":
        if (this._acceleration.x > 0) {
          this._acceleration.x = 0;
        }
        break;
      default:
    }
  }

  public update(stage: Stage): void {
    this._metadata.position.x += this._velocity.x;
    this._metadata.position.y += this._velocity.y;
    const collisionEventBelow = stage.getCollisionEventBelow(this._metadata);
    if (collisionEventBelow && this._velocity.y >= 0) {
      if (this._metadata.state === PlayerState.falling) {
        this._metadata.state = PlayerState.landed;
        this._metadata.spriteIndex = 354;
        this._animationTimer = ControlledPlayer.ANIMATION_BUFFER;
      }
      this._metadata.position.y = collisionEventBelow.position;
      this._acceleration.y = 0;
      if (this._velocity.x === 0) {
        this._metadata.spriteIndex = 354;
      } else {
        this._animationTimer--;
        if (this._animationTimer <= 0) {
          this._animationTimer = ControlledPlayer.ANIMATION_BUFFER;
          this._metadata.spriteIndex = this._metadata.spriteIndex >= 357 ? 354 : this._metadata.spriteIndex + 1;
        }
      }
    } else {
      this._acceleration.y = ControlledPlayer.GRAVITY;
      this._metadata.state = PlayerState.falling;
      this._metadata.spriteIndex = 358;
    }

    this._velocity.x += this._acceleration.x;
    const collisionEventAbove = stage.getCollisionEventAbove(this._metadata);
    if (collisionEventAbove?.tile === "solid") {
      this._metadata.position.y = collisionEventAbove.position;
      this._velocity.y = 0;
    } else {
      this._velocity.y = this._metadata.state === PlayerState.landed ? 0 : this._velocity.y + this._acceleration.y;
    }
    const collisionEventLeft = stage.getCollisionEventLeft(this._metadata);
    const collisionEventRight = stage.getCollisionEventRight(this._metadata);
    if (collisionEventLeft?.tile === "solid" && this._velocity.x < 0) {
      this._metadata.position.x = collisionEventLeft.position;
      this._velocity.x = 0;
    } else if (collisionEventRight?.tile === "solid" && this._velocity.x > 0) {
      this._metadata.position.x = collisionEventRight.position;
      this._velocity.x = 0;
    } else {
      if (this._acceleration.x === 0) {
        if (Math.abs(this._velocity.x) < ControlledPlayer.FRICTION) {
          this._velocity.x = 0;
        } else {
          this._velocity.x = this._velocity.x > 0
              ? this._velocity.x - ControlledPlayer.FRICTION
              : this._velocity.x + ControlledPlayer.FRICTION
        }
      }
      if (this._velocity.x >= ControlledPlayer.MAX_SPEED) {
        this._velocity.x = ControlledPlayer.MAX_SPEED;
      } else if (this._velocity.x <= -ControlledPlayer.MAX_SPEED) {
        this._velocity.x = -ControlledPlayer.MAX_SPEED;
      }
    }

    if (this._velocity.x > 0) {
      this._metadata.isFlipped = false;
    } else if (this._velocity.x < 0) {
      this._metadata.isFlipped = true;
    }
  }
}
