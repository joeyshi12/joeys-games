import { PlayerMetadata } from "../../../../../src/transfers/playerMetadata";

export class ControlledPlayer {
    public static ACCELERATION = 0.8;
    public static GRAVITY = 0.4;
    public static MAX_SPEED = 4.2;
    public static ANIMATION_BUFFER = 6;
    public static JUMP_VELOCITY = 9.4;

    constructor(private _metadata: PlayerMetadata) {
    }

    public get metadata(): PlayerMetadata {
        return this._metadata;
    }

    public keyPressed(key: string): void {
        switch (key.toLocaleUpperCase()) {
            case "W":
                this._metadata.position.y -= 5;
                break;
            case "A":
                this._metadata.position.x -= 5;
                break;
            case "S":
                this._metadata.position.y += 5;
                break;
            case "D":
                this._metadata.position.x += 5;
                break;
            default:
        }
    }

    public keyReleased(key: string): void {
        console.log(key.toLocaleUpperCase());
    }

    public update(): void {
        console.log("update")
    }
}