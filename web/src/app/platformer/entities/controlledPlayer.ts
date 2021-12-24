import { PlayerMetadata, PlayerState, Vector } from "../../../../../src/transfers/entity";

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
        if (this._metadata.position.y === 540) {
          this._metadata.position.y--;
          this._velocity.y = -ControlledPlayer.JUMP_VELOCITY;
        }
        break;
      case "A":
        this._acceleration.x = -ControlledPlayer.ACCELERATION;
        break;
      case "S":
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

  public update(): void {
    this._metadata.position.x += this._velocity.x;
    const nextPositionY = this._metadata.position.y + this._velocity.y;
    if (nextPositionY < 540) {
      this._metadata.position.y = nextPositionY;
      this._acceleration.y = ControlledPlayer.GRAVITY;
      this._metadata.state = PlayerState.falling;
      this._metadata.spriteIndex = 358;
    } else {
      if (this._metadata.state === PlayerState.falling) {
        this._metadata.state = PlayerState.landed;
        this._metadata.spriteIndex = 354;
        this._animationTimer = ControlledPlayer.ANIMATION_BUFFER;
      }
      this._metadata.position.y = 540;
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
    }
    this._velocity.x = this._computeNextHorizontalVelocity();
    this._velocity.y += this._acceleration.y;

    if (this._velocity.x > 0) {
      this._metadata.isFlipped = false;
    } else if (this._velocity.x < 0) {
      this._metadata.isFlipped = true;
    }
  }

  private _computeNextHorizontalVelocity(): number {
    const updatedVelocity = this._velocity.x + this._acceleration.x;
    if (this._acceleration.x === 0) {
      if (Math.abs(this._velocity.x) < ControlledPlayer.FRICTION) {
        return 0;
      } else {
        return this._velocity.x > 0
          ? this._velocity.x - ControlledPlayer.FRICTION
          : this._velocity.x + ControlledPlayer.FRICTION
      }
    }
    if (updatedVelocity >= ControlledPlayer.MAX_SPEED) {
      return ControlledPlayer.MAX_SPEED;
    } else if (updatedVelocity <= -ControlledPlayer.MAX_SPEED) {
      return -ControlledPlayer.MAX_SPEED;
    } else {
      return updatedVelocity;
    }
  }
}
