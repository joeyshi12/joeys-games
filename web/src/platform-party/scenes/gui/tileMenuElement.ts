import { SpriteSheet, SPRITE_LENGTH } from "../../loadAssets";
import { Point } from "./guiElements";

const TILE_MENU_HEIGHT = 70;
const TILE_MENU_PADDING = 10;
const TILE_BUTTON_LENGTH = 50;
const TILE_BUTTON_OFFSET = 60;

export class TileMenuElement {
    public isHovered: boolean = false;
    public selectedSpriteIndex?: number = undefined;

    private _translateX: number = 0;
    private readonly _maxTranslateX: number;
    private readonly _tileButtons: TileButtonElement[];

    public constructor(private readonly _ctx: CanvasRenderingContext2D,
                       spriteSheet: SpriteSheet) {
        this._tileButtons = [];
        for (let i = 1; i < spriteSheet.sprites.length; i++) {
            const button = new TileButtonElement(_ctx, i, spriteSheet.sprites[i], TILE_MENU_PADDING + (i - 1) * TILE_BUTTON_OFFSET, TILE_MENU_PADDING);
            this._tileButtons.push(button);
        }
        this._maxTranslateX = TILE_MENU_PADDING + this._tileButtons.length * TILE_BUTTON_OFFSET - _ctx.canvas.width;
    }

    public wheel(event: WheelEvent): void {
        this._translateX = Math.max(Math.min(this._translateX - event.deltaX, 0), -this._maxTranslateX);
    }

    public mouseDown(point: Point): void {
        point.x -= this._translateX;
        const selectedSpriteIndex = this._tileButtons.find(button => button.isContained(point))?.spriteIndex;
        if (!selectedSpriteIndex) {
            return;
        }
        for (let button of this._tileButtons) {
            if (button.spriteIndex !== selectedSpriteIndex) {
                button.isFocused = false;
                continue;
            }
            if (button.isFocused) {
                button.isFocused = false;
                this.selectedSpriteIndex = undefined;
                continue;
            }
            button.isFocused = true;
            this.selectedSpriteIndex = selectedSpriteIndex;
        }
    }

    public mouseMove(point: Point): void {
        if (point.x < 0 || point.x > this._ctx.canvas.width
            || point.y < 0 || point.y > TILE_MENU_HEIGHT) {
            this.isHovered = false;
            return;
        }
        this.isHovered = true;
    }

    public draw(): void {
        this._ctx.save();
        this._ctx.fillStyle = "rgba(0, 0, 0, 0.2)";
        this._ctx.fillRect(0, 0, this._ctx.canvas.width, TILE_MENU_HEIGHT);
        this._ctx.translate(this._translateX, 0);
        for (let button of this._tileButtons) {
            button.draw();
        }
        this._ctx.restore();
    }
}

class TileButtonElement {
    public isFocused: boolean = false;
    private _tileX: number;
    private _tileY: number;

    public constructor(private readonly _ctx: CanvasRenderingContext2D,
                       private readonly _spriteIndex: number,
                       private readonly _image: ImageBitmap,
                       private readonly _x: number,
                       private readonly _y: number) {
        this._tileX = _x + TILE_BUTTON_LENGTH / 2 - SPRITE_LENGTH;
        this._tileY = _y + TILE_BUTTON_LENGTH / 2 - SPRITE_LENGTH;
    }

    public get spriteIndex(): number {
        return this._spriteIndex;
    }

    public isContained(point: Point): boolean {
        return this._x < point.x && point.x < this._x + TILE_BUTTON_LENGTH
            && this._y < point.y && point.y < this._y + TILE_BUTTON_LENGTH;
    }

    public draw(): void {
        this._ctx.save();
        this._ctx.beginPath()
        this._ctx.roundRect(this._x, this._y, TILE_BUTTON_LENGTH, TILE_BUTTON_LENGTH, 2);

        this._ctx.fillStyle = "#1C1C1C";
        this._ctx.fill();

        this._ctx.strokeStyle = this.isFocused ? "#CCC" : "#333";
        this._ctx.lineWidth = 2;
        this._ctx.stroke();

        const length = SPRITE_LENGTH * 2;
        this._ctx.drawImage(this._image, this._tileX, this._tileY, length, length);
        this._ctx.restore();
    }
}
