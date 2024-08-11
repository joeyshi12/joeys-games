import { SPRITE_LENGTH } from "../loadAssets";
import PlatformPartyManager from "../platformPartyManager"
import { Point } from "./gui/guiElements";
import { TileMenuElement } from "./gui/tileMenuElement";
import { Scene } from "./scene"

export default class MapBuilderScene extends Scene {
    private _translation: Point = { x: 0, y: 0 };
    private _scale: number = 2;
    private _tileMenu: TileMenuElement;
    private _mouseWorldPosition?: Point;

    public constructor(manager: PlatformPartyManager) {
        super(manager);
        this._tileMenu = new TileMenuElement(this.manager.ctx, this.manager.spriteSheet);
    }

    public override mouseDown(event: MouseEvent): void {
        if (this._tileMenu.isHovered) {
            const point = this.manager.getWorldMousePosition(event);
            this._tileMenu.mouseDown(point);
            return;
        }
    }

    public override mouseMove(event: MouseEvent): void {
        const point = this.manager.getWorldMousePosition(event);
        this._tileMenu.mouseMove(point);
        this._mouseWorldPosition = point;
    }

    public override wheel(event: WheelEvent): void {
        event.preventDefault();
        if (this._tileMenu.isHovered) {
            this._tileMenu.wheel(event);
            return;
        }
        if (event.ctrlKey) {
            const { x: mouseX, y: mouseY } = this.manager.getWorldMousePosition(event);

            // https://d3js.org/d3-zoom#zoom_wheelDelta
            const trackpadMultiplier = Number.isInteger(event.deltaY) ? 1 : 10;
            const wheelDelta = -event.deltaY * (event.deltaMode === 1 ? 0.05 : event.deltaMode ? 1 : 0.002) * trackpadMultiplier;
            const scaleFactor = Math.pow(2, wheelDelta);

            this._translation.x -= (mouseX - this._translation.x) * (scaleFactor - 1);
            this._translation.y -= (mouseY - this._translation.y) * (scaleFactor - 1);
            this._scale *= scaleFactor;
        } else {
            this._translation.x -= event.deltaX;
            this._translation.y -= event.deltaY;
        }
    }

    public override draw() {
        this.manager.ctx.save();
        this.manager.ctx.fillStyle = "#1C1C1C";
        this.manager.ctx.fillRect(0, 0, this.manager.ctx.canvas.width, this.manager.ctx.canvas.height);
        this.manager.ctx.setTransform(this._scale, 0, 0, this._scale, this._translation.x, this._translation.y);
        this.manager.ctx.fillStyle = "#333";
        this.manager.ctx.fillRect(0, 0, SPRITE_LENGTH, SPRITE_LENGTH);
        this.manager.ctx.restore();

        if (this._mouseWorldPosition && this._tileMenu.selectedSpriteIndex) {
            const x = Math.floor(this._mouseWorldPosition.x / SPRITE_LENGTH) * SPRITE_LENGTH;
            const y = Math.floor(this._mouseWorldPosition.y / SPRITE_LENGTH) * SPRITE_LENGTH;
            this.manager.ctx.save();
            this.manager.ctx.globalAlpha = 0.5
            this.manager.ctx.drawImage(
                this.manager.spriteSheet.sprites[this._tileMenu.selectedSpriteIndex],
                x, y
            );
            this.manager.ctx.restore();
        }

        this._tileMenu.draw();
    }
}
