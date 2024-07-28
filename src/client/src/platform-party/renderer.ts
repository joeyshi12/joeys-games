import { PlayerMetadata, Vector } from "../../../models/platformPartyModels";
import { Stage } from "./scenes/stage";
import { SpriteSheet } from "./loadAssets";
import { Button, TextElement, TextInput } from "./scenes/gui";

export const CONTEXT_SCALE = 2;
export const SPRITE_LENGTH = 16;

export class Renderer {
    private _context: CanvasRenderingContext2D;
    private _translation: Vector;
    private _spriteSheet: SpriteSheet;

    public constructor() {
        this._translation = {x: 0, y: 0};
    }

    public set context(val: CanvasRenderingContext2D) {
        this._context = val;
    }

    public set spriteSheet(val: SpriteSheet) {
        this._spriteSheet = val;
    }

    public get spriteLength(): number {
        return this._spriteSheet.cellLength;
    }

    public resizeCanvas() {
        this._context.canvas.width = Math.min(1000, window.innerWidth);
        this._context.canvas.height = Math.min(600, window.innerHeight);
        this._context.scale(CONTEXT_SCALE, CONTEXT_SCALE);
    }

    public fill(color: string): void {
        this._context.fillStyle = color;
        this._context.fillRect(0, 0, this._context.canvas.width, this._context.canvas.height);
    }

    public drawPlayer(entity: PlayerMetadata) {
        this._context.save();
        this._context.fillStyle = "#ffffff";
        this._context.font = "8px \"Inconsolata\"";
        const textWidth = this._context.measureText(entity.name).width;
        this._context.fillText(
            entity.name,
            entity.position.x - this._translation.x - (textWidth - this.spriteLength) / 2,
            entity.position.y - this._translation.y
        );

        if (entity.isFlipped) {
            this._context.translate(2 * (entity.position.x - this._translation.x) + this.spriteLength, 0);
            this._context.scale(-1, 1);
        }
        this._context.drawImage(
            this._spriteSheet.sprites[entity.spriteIndex],
            Math.floor(entity.position.x - this._translation.x),
            Math.floor(entity.position.y - this._translation.y),
            this.spriteLength,
            this.spriteLength
        );
        this._context.restore();
    }

    public drawStage(stage: Stage) {
        this.fill("#1C1C1C");
        const mapData = stage.mapData;
        const cellLength = this._spriteSheet.cellLength;
        for (let i = 0; i < mapData.rows; i++) {
            for (let j = 0; j < mapData.columns; j++) {
                const tileIdx = i * mapData.columns + j;
                const spriteId = mapData.spriteData[tileIdx];
                if (spriteId === 0) {
                    continue;
                }
                this._context.drawImage(
                    this._spriteSheet.sprites[spriteId],
                    Math.floor(j * cellLength - this._translation.x),
                    Math.floor(i * cellLength - this._translation.y),
                    cellLength,
                    cellLength
                );
            }
        }
    }

    public updateCameraPosition(focalPoint: Vector, stage: Stage): void {
        const canvas = this._context.canvas;
        this._translation.x = focalPoint.x - canvas.width / (2 * CONTEXT_SCALE);
        this._translation.y = focalPoint.y - canvas.height / (2 * CONTEXT_SCALE);

        const mapWidth = stage.mapData.columns * this.spriteLength;
        const mapHeight = stage.mapData.rows * this.spriteLength;
        const maxCameraX = mapWidth - canvas.width / 2;
        const maxCameraY = mapHeight - canvas.height / 2;
        if (this._translation.x > maxCameraX) {
            this._translation.x = maxCameraX;
        }
        if (this._translation.x < 0) {
            this._translation.x = 0;
        }
        if (this._translation.y > maxCameraY) {
            this._translation.y = maxCameraY;
        }
    }

    public drawText(textElement: TextElement): void {
        this._context.save();
        this._context.fillStyle = "#ffffff";
        this._context.font = `${textElement.fontSize}px "Inconsolata"`;
        this._context.fillText(textElement.text, textElement.x, textElement.y);
        this._context.restore();
    }

    public drawTextInput(textInput: TextInput): void {
        this._context.save();
        this._context.font = `${textInput.fontSize}px "Arial" sans-serif`;
        this._context.fillStyle = "#ffffff";
        this._context.fillRect(
            textInput.x,
            textInput.y,
            textInput.width,
            textInput.fontSize + 4 // vertical padding below
        );

        const padding = 2;
        let startIndex = textInput.text.length - 1;
        let textWidth = 2 * padding;
        while (startIndex > 0) {
            textWidth += this._context.measureText(textInput.text.charAt(startIndex)).width;
            if (textWidth > textInput.width) break;
            startIndex--;
        }
        const displayText = textInput.text.slice(startIndex);
        this._context.fillStyle = "#000000";
        this._context.fillText(displayText, textInput.x + padding, textInput.y + textInput.fontSize);
        this._context.restore();
    }

    public drawButton(button: Button): void {
        this._context.save();
        // this._context.fillStyle = "#ffffff"
        // this._context.fillRect(button.x, button.y, button.width, button.height);
        this._context.font = `${button.fontSize}px "Inconsolata"`;
        let buttonLeft = button.x + 5; // TODO: remove positioning hacks
        this._context.fillStyle = "#ffffff";
        if (button.isHovered) {
            this._context.font = `${button.fontSize + 2}px "Inconsolata"`;
            buttonLeft -= 2;
        }
        this._context.fillText(button.text, buttonLeft, button.y + button.fontSize);
        this._context.restore();
    }
}
