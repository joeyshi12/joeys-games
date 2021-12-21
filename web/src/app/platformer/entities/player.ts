import {Drawable} from "./drawable";

export class Player implements Drawable {
  ACCELERATION = 0.8;
  GRAVITY = 0.4;
  MAX_SPEED = 4.2;
  ANIMATION_BUFFER = 6;
  JUMP_VELOCITY = 9.4;
  private readonly playJumpSound: () => void;
  private readonly playLandSound: () => void;
  private direction: number;
  private animator: Animator;
  private animTimer: number;
  private isGrounded: boolean;
  private isDead: boolean;


  public isFlipped: boolean;

  constructor(p5: P5, x: number, y: number, manager: PlatformerSketch) {
    super(p5, x, y, 0, 0, 26, 22);
    this.playJumpSound = () => { manager.playSound('jump'); };
    this.playLandSound = () => { manager.playSound('land'); };
    this.direction = 0;
    this.animator = new Animator([[7, 18], [7, 19], [7, 20], [7, 21], [7, 22], [7, 23]], manager.getSpriteSheet(), 1);
    this.animTimer = this.ANIMATION_BUFFER;
    this.isGrounded = true;
    this.isFlipped = true;
    this.isDead = false;
  }

  update(map: GameMap): void {
    this.updateAnimation();
    this.updateVelocity();
    this.handleCollisions(map);
    [this.x, this.y] = this.nextPosition();
  }

  jump(): void {
    if (this.isGrounded) {
      this.playJumpSound();
      this.vy = -this.JUMP_VELOCITY;
      this.isGrounded = false;
    }
  }

  dropFromPlatform(map: GameMap): void {
    if (this.isGrounded) {
      const bottomTileRow = Math.floor(this.y / Global.unitLength) + 1;
      const leftTileCol = Math.floor(this.x / Global.unitLength);
      const rightTileCol = Math.floor((this.x + this.width) / Global.unitLength);
      if (!(map.isSolidAt(bottomTileRow, leftTileCol) || map.isSolidAt(bottomTileRow, rightTileCol))) {
        this.y += 1;
      }
    }
  }

  private handleCollisions(map: GameMap): void {
    this.handleGroundCollision(map);
    this.handleCeilingCollision(map);
    this.handleLeftCollision(map);
    this.handleRightCollision(map);
  }

  private handleGroundCollision(map: GameMap): void {
    if (this.vy < 0) {
      this.isGrounded = false;
      return;
    }
    const bottomTileRow = Math.floor((this.y + this.height) / Global.unitLength) + 1;
    const leftTileCol = Math.floor(this.x / Global.unitLength);
    const rightTileCol = Math.floor((this.x + this.width) / Global.unitLength);
    const isCollidingWithBottomTile = this.y + this.vy + this.height >= bottomTileRow * Global.unitLength - 1;
    const isBottomLeftGround = map.isSolidAt(bottomTileRow, leftTileCol) || map.isPlatformAt(bottomTileRow, leftTileCol);
    const isBottomRightGround = map.isSolidAt(bottomTileRow, rightTileCol) || map.isPlatformAt(bottomTileRow, rightTileCol);
    // drawing for debugging purposes
    // map.drawTile(5 * 48 + 8, bottomTileRow, leftTileCol);
    // map.drawTile(5 * 48 + 8, bottomTileRow, rightTileCol);
    if (isCollidingWithBottomTile && (isBottomLeftGround || isBottomRightGround)) {
      if (!this.isGrounded) {
        this.playLandSound();
        this.isGrounded = true;
      }
      this.y = bottomTileRow * Global.unitLength - this.height - 1;
      this.vy = 0;
    } else {
      this.isGrounded = false;
    }
  }

  private handleCeilingCollision(map: GameMap): void {
    const topTileRow = Math.floor(this.y / Global.unitLength) - 1;
    const leftTileCol = Math.floor(this.x / Global.unitLength);
    const rightTileCol = Math.floor((this.x + this.width) / Global.unitLength);
    const isCollidingWithTopTile = this.y + this.vy <= (topTileRow + 1) * Global.unitLength + 1;
    const isBottomLeftCeiling = map.isSolidAt(topTileRow, leftTileCol);
    const isBottomRightCeiling = map.isSolidAt(topTileRow, rightTileCol);
    // drawing for debugging purposes
    // map.drawTile(5 * 48 + 8, bottomTileRow, leftTileCol);
    // map.drawTile(5 * 48 + 8, bottomTileRow, rightTileCol);
    if (isCollidingWithTopTile && (isBottomLeftCeiling || isBottomRightCeiling)) {
      this.y = (topTileRow + 1) * Global.unitLength + 1;
      this.vy = 1;
    }
  }

  private handleLeftCollision(map: GameMap): void {
    const [x, y] = this.nextPosition();
    const leftTileCol = Math.floor((x + this.width / 2) / Global.unitLength) - 1;
    const topTileRow = Math.floor(y / Global.unitLength);
    const bottomTileRow = Math.floor((y + this.height) / Global.unitLength);
    const isCollidingWithLeftTile = x <= (leftTileCol + 1) * Global.unitLength;
    // drawing for debugging purposes
    // map.drawTile(5 * 48 + 8, bottomTileRow, leftTileCol);
    // map.drawTile(5 * 48 + 8, topTileRow, leftTileCol);
    if (isCollidingWithLeftTile && (map.isSolidAt(bottomTileRow, leftTileCol) || map.isSolidAt(topTileRow, leftTileCol))) {
      this.x = (leftTileCol + 1) * Global.unitLength;
      if (this.vx < 0) {
        this.vx = 0;
      }
    }
  }

  private handleRightCollision(map: GameMap): void {
    const [x, y] = this.nextPosition();
    const rightTileCol = Math.floor((x + this.width / 2) / Global.unitLength) + 1;
    const topTileRow = Math.floor(y / Global.unitLength);
    const bottomTileRow = Math.floor((y + this.height) / Global.unitLength);
    const isCollidingWithRightTile = x + this.width >= rightTileCol * Global.unitLength - 1;
    // drawing for debugging purposes
    // map.drawTile(5 * 48 + 8, bottomTileRow, rightTileCol);
    // map.drawTile(5 * 48 + 8, topTileRow, rightTileCol);
    if (isCollidingWithRightTile && (map.isSolidAt(bottomTileRow, rightTileCol) || map.isSolidAt(topTileRow, rightTileCol))) {
      this.x = rightTileCol * Global.unitLength - this.width - 1;
      if (this.vx > 0) {
        this.vx = 0;
      }
    }
  }

  private updateVelocity(): void {
    if (!this.isGrounded) {
      this.vy += this.GRAVITY;
    }
    this.updateHorizontalVelocity();
  }

  private updateHorizontalVelocity(): void {
    if (this.direction === 0 || this.isDead) {
      if (this.vx > 0) {
        this.vx = Math.max(0, this.vx - this.ACCELERATION);
      } else if (this.vx < 0) {
        this.vx = Math.min(0, this.vx + this.ACCELERATION);
      }
    } else {
      if (this.direction === 1) {
        this.vx = Math.min(this.MAX_SPEED, this.vx + this.ACCELERATION);
      } else {
        this.vx = Math.max(-this.MAX_SPEED, this.vx - this.ACCELERATION);
      }
    }
  }

  private updateAnimation(): void {
    if (this.isDead) {
      this.animator.setAnimIdx(5);
    } else {
      if (this.isGrounded) {
        if (this.animTimer > 0) {
          this.animTimer--;
        } else {
          this.animTimer = this.ANIMATION_BUFFER;
          if (this.vx === 0) {
            this.animator.setAnimIdx(0);
          } else {
            this.animator.setAnimIdx((this.animator.getAnimIdx() + 1) % 4);
          }
        }
      } else {
        this.animator.setAnimIdx(4);
      }
    }
  }

  private drawCollisionBox(): void {
    const [x, y] = Global.camera.shift(this.x, this.y);
    this.p5.push();
    this.p5.fill(255);
    this.p5.rect(x, y, this.width, this.height);
    this.p5.pop();
  }

  getDirection(): number {
    return this.direction;
  }

  getIsDead(): boolean {
    return this.isDead;
  }

  setDirection(direction: number): void {
    this.direction = direction;
    if (direction !== 0) {
      this.isFlipped = direction === 1;
    }
  }

  setIsDead(isDead: boolean): void {
    this.isDead = isDead;
  }
}
