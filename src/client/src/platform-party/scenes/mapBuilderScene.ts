import { MapData } from "../../../../models/platformPartyModels";
import { SPRITE_LENGTH } from "../loadAssets";
import PlatformPartyManager from "../platformPartyManager"
import { ButtonElement } from "./gui/buttonElement";
import { MouseInteractiveElement, Point } from "./gui/guiElement";
import { TileMenuElement } from "./gui/tileMenuElement";
import { Scene } from "./scene"
import StartMenuScene from "./startMenuScene";
import { clamp } from "./util";

const MAX_WHEEL_DELTA = 0.3;
const MAX_TRANSLATION_DELTA = 30;
const MAX_TILE_MENU_SCROLL = 50;

interface MapTile {
    spriteIndex: number;
    row: number;
    column: number;
}

export default class MapBuilderScene extends Scene {
    private _translation: Point = { x: 0, y: 0 };
    private _scale: number = 2;
    private _mouseWorldPosition?: Point;
    private _tiles: MapTile[] = [];
    private _isMouseDown: boolean = false;
    private _tileMenu: TileMenuElement;
    private _interactiveElements: MouseInteractiveElement[];

    public constructor(manager: PlatformPartyManager) {
        super(manager);
        this._tileMenu = new TileMenuElement(manager.ctx, this.manager.spriteSheet);
        const downloadMapButton: ButtonElement = new ButtonElement(
            manager.ctx, "Download map", manager.ctx.canvas.width - 140, manager.ctx.canvas.height - 100,
            130, 40, () => {
                this.manager.getSound("click").play();
                this._downloadMap();
            }
        );
        const menuButton: ButtonElement = new ButtonElement(
            manager.ctx, "Back to menu", manager.ctx.canvas.width - 140, manager.ctx.canvas.height - 50,
            130, 40, () => {
                this.manager.getSound("click").play();
                this._navigateToMenu();
            }
        );
        this._interactiveElements = [this._tileMenu, downloadMapButton, menuButton];
    }

    public get isUIElementHovered(): boolean {
        return this._interactiveElements.some(element => element.isHovered);
    }

    public get scaledSpriteLength(): number {
        return SPRITE_LENGTH * this._scale;
    }

    public override mouseDown(event: MouseEvent): void {
        this._isMouseDown = true;
        const point = this.manager.getWorldMousePosition(event);
        for (let element of this._interactiveElements) {
            if (element.mouseDown(point)) {
                return
            }
        }
    }

    public override mouseUp(_: MouseEvent): void {
        this._isMouseDown = false;
    }

    public override mouseMove(event: MouseEvent): void {
        const point = this.manager.getWorldMousePosition(event);
        for (let element of this._interactiveElements) {
            element.mouseMove(point);
        }

        if (this._tileMenu.selectedSpriteIndex !== undefined) {
            this._mouseWorldPosition = point;
            if (!this.isUIElementHovered && this._isMouseDown) {
                const tileCol: number = Math.floor((point.x - this._translation.x) / this.scaledSpriteLength);
                const tileRow: number = Math.floor((point.y - this._translation.y) / this.scaledSpriteLength);
                if (this._tileMenu.isDeleteMode) {
                    this._tiles = this._tiles.filter(tile => tile.row !== tileRow || tile.column !== tileCol);
                } else {
                    const tile = this._tiles.find(tile => tile.row === tileRow && tile.column === tileCol);
                    if (tile) {
                        tile.spriteIndex = this._tileMenu.selectedSpriteIndex;
                    } else {
                        this._tiles.push({
                            spriteIndex: this._tileMenu.selectedSpriteIndex,
                            row: tileRow,
                            column: tileCol
                        });
                    }
                }
            }
        }
    }

    public override keyDown(event: KeyboardEvent): void {
        if (event.key.toLowerCase() === "d") {
            this._tileMenu.toggleDeleteMode();
        }
    }

    public override wheel(event: WheelEvent): void {
        event.preventDefault();
        if (this._tileMenu.isHovered) {
            const scrollAmount = clamp(event.deltaX !== 0 ? event.deltaX : event.deltaY, -MAX_TILE_MENU_SCROLL, MAX_TILE_MENU_SCROLL);
            this._tileMenu.scroll(scrollAmount);
            return;
        }
        if (event.ctrlKey) {
            const { x: mouseX, y: mouseY } = this.manager.getWorldMousePosition(event);

            // https://d3js.org/d3-zoom#zoom_wheelDelta
            const wheelDelta = clamp(
                -event.deltaY * (event.deltaMode === 1 ? 0.05 : event.deltaMode ? 1 : 0.002) * 10,
                -MAX_WHEEL_DELTA,
                MAX_WHEEL_DELTA
            );
            const scaleFactor = Math.pow(2, wheelDelta);

            this._translation.x -= (mouseX - this._translation.x) * (scaleFactor - 1);
            this._translation.y -= (mouseY - this._translation.y) * (scaleFactor - 1);
            this._scale *= scaleFactor;
        } else if (event.shiftKey) {
            this._translation.x -= clamp(
                event.deltaX !== 0 ? event.deltaX : event.deltaY,
                -MAX_TRANSLATION_DELTA,
                MAX_TRANSLATION_DELTA
            );
        } else {
            this._translation.x -= clamp(event.deltaX, -MAX_TRANSLATION_DELTA, MAX_TRANSLATION_DELTA);
            this._translation.y -= clamp(event.deltaY, -MAX_TRANSLATION_DELTA, MAX_TRANSLATION_DELTA);
        }
    }

    public override draw() {
        this.manager.ctx.save();
        this.manager.ctx.fillStyle = "#1C1C1C";
        this.manager.ctx.fillRect(0, 0, this.manager.ctx.canvas.width, this.manager.ctx.canvas.height);
        for (let tile of this._tiles) {
            this.manager.ctx.drawImage(
                this.manager.spriteSheet.sprites[tile.spriteIndex],
                tile.column * this.scaledSpriteLength + this._translation.x,
                tile.row * this.scaledSpriteLength + this._translation.y,
                this.scaledSpriteLength,
                this.scaledSpriteLength
            );
        }
        if (!this.isUIElementHovered && this._mouseWorldPosition !== undefined) {
            this.manager.ctx.globalAlpha = 0.5;
            const tileCol: number = Math.floor((this._mouseWorldPosition.x - this._translation.x) / this.scaledSpriteLength);
            const tileRow: number = Math.floor((this._mouseWorldPosition.y - this._translation.y) / this.scaledSpriteLength);
            if (this._tileMenu.isDeleteMode) {
                this.manager.ctx.save();
                this.manager.ctx.fillStyle = "#ff0000";
                this.manager.ctx.fillRect(
                    tileCol * this.scaledSpriteLength + this._translation.x,
                    tileRow * this.scaledSpriteLength + this._translation.y,
                    this.scaledSpriteLength,
                    this.scaledSpriteLength
                );
                this.manager.ctx.restore();
            } else if (this._tileMenu.selectedSpriteIndex !== undefined) {
                this.manager.ctx.drawImage(
                    this.manager.spriteSheet.sprites[this._tileMenu.selectedSpriteIndex],
                    tileCol * this.scaledSpriteLength + this._translation.x,
                    tileRow * this.scaledSpriteLength + this._translation.y,
                    this.scaledSpriteLength,
                    this.scaledSpriteLength
                );
            }
        }
        this.manager.ctx.restore();
        for (let element of this._interactiveElements) {
            element.draw(this.manager.ctx);
        }
    }

    private _navigateToMenu(): void {
        this.manager.scene = new StartMenuScene(this.manager);
    }

    private _downloadMap(): void {
        const downloadAnchor = <HTMLAnchorElement>document.querySelector("a#download-anchor");

        const tileColumns = this._tiles.map(tile => tile.column);
        const tileRows = this._tiles.map(tile => tile.row);
        const minColumn = Math.min(...tileColumns);
        const minRow = Math.min(...tileRows);
        const columns = Math.max(...tileColumns) - minColumn + 1;
        const rows = Math.max(...tileRows) - minRow + 1;
        const spriteData = Array(columns * rows).fill(0);
        for (let tile of this._tiles) {
            const column = tile.column - minColumn;
            const row = tile.row - minRow;
            spriteData[column + row * columns] = tile.spriteIndex;
        }
        const stageMap: MapData = {
            name: "customMap",
            rows, columns, spriteData,
            solidIndices: [],
            platformIndices: []
        };

        const file = new Blob([JSON.stringify(stageMap, null, 2)], { type: "application/json" });
        downloadAnchor.href = URL.createObjectURL(file);
        downloadAnchor.download = stageMap.name;
        downloadAnchor.click();
    }
}
