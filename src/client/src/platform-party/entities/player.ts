import { Character, PlayerMetadata, PlayerState, Vector } from "../../../../models/platformPartyModels";
import { Stage, TileType } from "../scenes/stage";
import { AnimationControl } from "./animationControl";
import { Sound } from "../../core/sound";
import { SPRITE_LENGTH } from "../loadAssets";

const ACCELERATION = 1;
const GRAVITY = 0.3;
const MAX_SPEED = 3;
const JUMP_VELOCITY = 6;
const FRICTION = 0.4;

export class Player {
    private _velocity: Vector = {x: 0, y: 0};
    private _acceleration: Vector = {x: 0, y: 0};
    private _animationControl: AnimationControl;

    constructor(private _metadata: PlayerMetadata,
                private _jumpSound: Sound,
                private _landSound: Sound) {
        this._animationControl = new AnimationControl(buildAnimationStates(_metadata.character));
    }

    public get metadata(): PlayerMetadata {
        return this._metadata;
    }

    public keyPressed(key: string): void {
        switch (key.toLocaleUpperCase()) {
            case "W":
                if (this._isGrounded) {
                    this._jumpSound.play();
                    this._metadata.position.y--;
                    this._velocity.y = -JUMP_VELOCITY;
                    this._animationControl.state = PlayerState.FALLING;
                }
                return;
            case "A":
                this._acceleration.x = -ACCELERATION;
                return;
            case "D":
                this._acceleration.x = ACCELERATION;
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
        if (this._animationControl.state === PlayerState.DEAD) {
            return;
        }
        if (this._isDamaged(stage)) {
            this._animationControl.state = PlayerState.DEAD;
            setTimeout(() => this._reset(), 2000);
        }
        if (this._metadata.position.y > stage.mapData.rows * SPRITE_LENGTH) {
            this._reset();
            return;
        }

        this._metadata.position.x += this._velocity.x;
        this._metadata.position.y += this._velocity.y;

        this._velocity.x += this._acceleration.x;
        const collisionEventLeft = stage.getCollisionEventLeft(this._metadata);
        const collisionEventRight = stage.getCollisionEventRight(this._metadata);
        if (collisionEventLeft?.tile === TileType.SOLID && this._velocity.x < 0) {
            this._metadata.position.x = collisionEventLeft.position;
            this._velocity.x = 0;
        } else if (collisionEventRight?.tile === TileType.SOLID && this._velocity.x > 0) {
            this._metadata.position.x = collisionEventRight.position;
            this._velocity.x = 0;
        } else {
            if (this._acceleration.x === 0) {
                if (Math.abs(this._velocity.x) < FRICTION) {
                    this._velocity.x = 0;
                } else {
                    this._velocity.x = this._velocity.x > 0
                        ? this._velocity.x - FRICTION
                        : this._velocity.x + FRICTION;
                }
            }
            if (this._velocity.x >= MAX_SPEED) {
                this._velocity.x = MAX_SPEED;
            } else if (this._velocity.x <= -MAX_SPEED) {
                this._velocity.x = -MAX_SPEED;
            }
        }

        const collisionEventBelow = stage.getCollisionEventBelow(this._metadata, this._velocity.y);
        if (collisionEventBelow && this._velocity.y >= 0) {
            this._metadata.position.y = collisionEventBelow.position;
            this._acceleration.y = 0;
            if (this._animationControl.state === PlayerState.FALLING) {
                this._animationControl.state = PlayerState.STANDING;
                this._landSound.play();
            }
            if (this._velocity.x === 0) {
                if (this._animationControl.state !== PlayerState.STANDING) {
                    this._animationControl.state = PlayerState.STANDING;
                }
            } else {
                if (this._animationControl.state === PlayerState.STANDING) {
                    this._animationControl.state = PlayerState.WALKING;
                } else if (this._animationControl.state === PlayerState.WALKING) {
                    this._animationControl.update();
                }
            }
        } else {
            this._acceleration.y = GRAVITY;
            this._animationControl.state = PlayerState.FALLING;
        }
        this._metadata.spriteIndex = this._animationControl.spriteIndex;

        const collisionEventAbove = stage.getCollisionEventAbove(this._metadata);
        if (collisionEventAbove?.tile === TileType.SOLID) {
            this._metadata.position.y = collisionEventAbove.position;
            this._velocity.y = 0;
        } else {
            this._velocity.y = this._isGrounded ? 0 : this._velocity.y + this._acceleration.y;
        }

        if (this._velocity.x > 0) {
            this._metadata.isFlipped = false;
        } else if (this._velocity.x < 0) {
            this._metadata.isFlipped = true;
        }
    }

    private get _isGrounded(): boolean {
        return this._animationControl.state === PlayerState.STANDING
            || this._animationControl.state === PlayerState.WALKING;
    }

    private _isDamaged(stage: Stage): boolean {
        const row = Math.floor((this._metadata.position.y + this._metadata.collisionBox.offset.y + this._metadata.collisionBox.height / 2) / SPRITE_LENGTH);
        const col = Math.floor((this._metadata.position.x + this._metadata.collisionBox.offset.x + this._metadata.collisionBox.width / 2) / SPRITE_LENGTH);
        return stage.mapData.spriteData[row * stage.mapData.columns + col] === 22;
    }

    private _reset(): void {
        this._metadata.position.x = 120;
        this._metadata.position.y = 200;
        this._velocity.x = 0;
        this._velocity.y = 0;
        this._animationControl.state = PlayerState.FALLING;
        this._metadata.isFlipped = false;
    }
}

function buildAnimationStates(character: Character): Map<PlayerState, number[]> {
    switch (character) {
        case Character.ORANGE:
            return new Map([
                [PlayerState.STANDING, [402]],
                [PlayerState.WALKING, [402, 403, 404, 405]],
                [PlayerState.FALLING, [406]],
                [PlayerState.DEAD, [407]]
            ]);
        case Character.GREEN:
            return new Map([
                [PlayerState.STANDING, [450]],
                [PlayerState.WALKING, [450, 451, 452, 453]],
                [PlayerState.FALLING, [454]],
                [PlayerState.DEAD, [455]]
            ]);
        default: // blue
            return new Map([
                [PlayerState.STANDING, [354]],
                [PlayerState.WALKING, [354, 355, 356, 357]],
                [PlayerState.FALLING, [358]],
                [PlayerState.DEAD, [359]]
            ]);
    }
}
