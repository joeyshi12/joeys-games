import { SpriteSheet, SPRITE_LENGTH } from "../../loadAssets";
import { clamp } from "../util";
import { MouseInteractiveElement, Point } from "./guiElement";

const TILE_MENU_HEIGHT = 70;
const TILE_MENU_PADDING = 10;
const TILE_BUTTON_LENGTH = 50;
const TILE_BUTTON_OFFSET = 60;

export class TileMenuElement extends MouseInteractiveElement {
    public selectedSpriteIndex?: number = undefined;

    private _translateX: number = 0;
    private _isDeleteMode: boolean = false;
    private readonly _maxTranslateX: number;
    private readonly _tileButtons: TileButtonElement[];

    public constructor(ctx: CanvasRenderingContext2D, spriteSheet: SpriteSheet) {
        const width: number = ctx.canvas.width;
        super(0, 0, width, TILE_MENU_HEIGHT);
        this._tileButtons = [];
        for (let i = 1; i < spriteSheet.sprites.length; i++) {
            const button = new TileButtonElement(i, spriteSheet.sprites[i], TILE_MENU_PADDING + (i - 1) * TILE_BUTTON_OFFSET, TILE_MENU_PADDING);
            this._tileButtons.push(button);
        }
        this._maxTranslateX = TILE_MENU_PADDING + this._tileButtons.length * TILE_BUTTON_OFFSET - width;
    }

    public get isDeleteMode(): boolean {
        return this._isDeleteMode;
    }

    public scroll(amount: number): void {
        this._translateX = clamp(this._translateX - amount, -this._maxTranslateX, 0);
    }

    public toggleDeleteMode(): void {
        this._isDeleteMode = !this._isDeleteMode;
    }

    public override mouseDown(point: Point): boolean {
        if (!this._isHovered) {
            return false;
        }
        point.x -= this._translateX;
        const selectedSpriteIndex = this._tileButtons.find(button => button.isContained(point))?.spriteIndex;
        if (!selectedSpriteIndex) {
            return true;
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
        return true;
    }

    public override draw(ctx: CanvasRenderingContext2D): void {
        ctx.save();
        ctx.fillStyle = "rgba(0, 0, 0, 0.2)";
        ctx.fillRect(0, 0, ctx.canvas.width, TILE_MENU_HEIGHT);
        ctx.translate(this._translateX, 0);
        for (let button of this._tileButtons) {
            button.draw(ctx);
        }
        ctx.restore();
    }
}

class TileButtonElement {
    public isFocused: boolean = false;
    private _tileX: number;
    private _tileY: number;

    public constructor(public readonly spriteIndex: number,
                       private readonly _image: ImageBitmap,
                       private readonly _x: number,
                       private readonly _y: number) {
        this._tileX = _x + TILE_BUTTON_LENGTH / 2 - SPRITE_LENGTH;
        this._tileY = _y + TILE_BUTTON_LENGTH / 2 - SPRITE_LENGTH;
    }

    public isContained(point: Point): boolean {
        return this._x < point.x && point.x < this._x + TILE_BUTTON_LENGTH
            && this._y < point.y && point.y < this._y + TILE_BUTTON_LENGTH;
    }

    public draw(ctx: CanvasRenderingContext2D): void {
        ctx.save();
        ctx.beginPath()
        ctx.roundRect(this._x, this._y, TILE_BUTTON_LENGTH, TILE_BUTTON_LENGTH, 2);

        ctx.fillStyle = "#1C1C1C";
        ctx.fill();

        ctx.strokeStyle = this.isFocused ? "#CCC" : "#333";
        ctx.lineWidth = 2;
        ctx.stroke();

        const length = SPRITE_LENGTH * 2;
        ctx.drawImage(this._image, this._tileX, this._tileY, length, length);
        ctx.restore();
    }
}
