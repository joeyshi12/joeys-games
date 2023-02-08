import {PlayerMetadata, Vector} from "../../src/types/playerMetadata";
import {Stage, StageMap} from "./scenes/stage";
import {SpriteSheet} from "./loadAssets";
import {Button, TextElement, TextInput} from "./scenes/gui";


export class Renderer {
    public static readonly CONTEXT_SCALE: number = 2;
    public static readonly SPRITE_LENGTH: number = 16;

    private _cameraPosition: Vector;
    private _spriteSheet: SpriteSheet;

    public constructor() {
        this._cameraPosition = {x: 0, y: 0};
    }

    public set spriteSheet(val: SpriteSheet) {
        this._spriteSheet = val;
    }

    public get spriteLength(): number {
        return this._spriteSheet.cellLength;
    }

    public resizeCanvas(context: CanvasRenderingContext2D) {
        context.canvas.width = Math.min(1200, window.innerWidth);
        context.canvas.height = Math.min(700, window.innerHeight);
        context.scale(Renderer.CONTEXT_SCALE, Renderer.CONTEXT_SCALE);
    }

    public fill(context: CanvasRenderingContext2D, color: string): void {
        context.fillStyle = color;
        context.fillRect(0, 0, context.canvas.width, context.canvas.height);
        context.fillRect(0, 0, context.canvas.width, context.canvas.height);
    }

    public drawPlayer(context: CanvasRenderingContext2D, entity: PlayerMetadata) {
        context.save();
        context.fillStyle = "#ffffff";
        context.font = "8px \"Inconsolata\"";
        const textWidth = context.measureText(entity.name).width;
        context.fillText(
            entity.name,
            entity.position.x - this._cameraPosition.x - (textWidth - this.spriteLength) / 2,
            entity.position.y - this._cameraPosition.y
        );

        if (entity.isFlipped) {
            context.translate(2 * (entity.position.x - this._cameraPosition.x) + this.spriteLength, 0);
            context.scale(-1, 1);
        }
        context.drawImage(
            this._spriteSheet.sprites[entity.spriteIndex],
            Math.floor(entity.position.x - this._cameraPosition.x),
            Math.floor(entity.position.y - this._cameraPosition.y),
            this.spriteLength,
            this.spriteLength
        );
        context.restore();
    }

    public drawStage(context: CanvasRenderingContext2D, stageMap: StageMap) {
        this.fill(context, "#1C1C1C");
        const cellLength = this._spriteSheet.cellLength;
        for (let i = 0; i < stageMap.rows; i++) {
            for (let j = 0; j < stageMap.columns; j++) {
                const tileIdx = i * stageMap.columns + j;
                const spriteId = stageMap.spriteData[tileIdx];
                if (spriteId === 0) {
                    continue;
                }
                context.drawImage(
                    this._spriteSheet.sprites[spriteId],
                    Math.floor(j * cellLength - this._cameraPosition.x),
                    Math.floor(i * cellLength - this._cameraPosition.y),
                    cellLength,
                    cellLength
                );
            }
        }
    }

    public drawText(context: CanvasRenderingContext2D, textElement: TextElement): void {
        context.save();
        context.fillStyle = "#ffffff";
        context.font = `${textElement.fontSize}px "Inconsolata"`;
        context.fillText(textElement.text, textElement.x, textElement.y);
        context.restore();
    }

    public drawTextInput(context: CanvasRenderingContext2D, textInput: TextInput): void {
        context.save();
        context.font = `${textInput.fontSize}px "Arial" sans-serif`;
        context.fillStyle = "#ffffff";
        context.fillRect(
            textInput.x,
            textInput.y,
            textInput.width,
            textInput.fontSize + 4 // vertical padding below
        );

        const padding = 2;
        let startIndex = textInput.text.length - 1;
        let textWidth = 2 * padding;
        while (startIndex > 0) {
            textWidth += context.measureText(textInput.text.charAt(startIndex)).width;
            if (textWidth > textInput.width) break;
            startIndex--;
        }
        const displayText = textInput.text.slice(startIndex);
        context.fillStyle = "#000000";
        context.fillText(displayText, textInput.x + padding, textInput.y + textInput.fontSize);
        context.restore();
    }

    public drawButton(context: CanvasRenderingContext2D, button: Button): void {
        context.save();
        // context.fillStyle = "#ffffff"
        // context.fillRect(button.x, button.y, button.width, button.height);
        context.font = `${button.fontSize}px "Inconsolata"`;
        let buttonLeft = button.x + 5; // TODO: remove positioning hacks
        context.fillStyle = "#ffffff";
        if (button.isHovered) {
            context.font = `${button.fontSize + 2}px "Inconsolata"`;
            buttonLeft -= 2;
        }
        context.fillText(button.text, buttonLeft, button.y + button.fontSize);
        context.restore();
    }

    public drawMapList(context: CanvasRenderingContext2D, maps: StageMap[]): void {
        this.fill(context, "#1C1C1C");
        const totalWidth = context.canvas.width / Renderer.CONTEXT_SCALE;
        const percentageWidth = 0.8;
        const width = percentageWidth * totalWidth;
        const height = 20 * maps.length;
        context.lineWidth = 1;
        context.strokeStyle = "#ffffff";
        context.strokeRect((1 - percentageWidth) * totalWidth, 40, width, height);
    }

    public updateCameraPosition(context: CanvasRenderingContext2D, focalPoint: Vector, stage: Stage): void {
        const canvas = context.canvas;
        this._cameraPosition.x = focalPoint.x - canvas.width / (2 * Renderer.CONTEXT_SCALE);
        this._cameraPosition.y = focalPoint.y - canvas.height / (2 * Renderer.CONTEXT_SCALE);

        const mapWidth = stage.mapData.columns * this.spriteLength;
        const mapHeight = stage.mapData.rows * this.spriteLength;
        const maxCameraX = mapWidth - canvas.width / 2;
        const maxCameraY = mapHeight - canvas.height / 2;
        if (this._cameraPosition.x > maxCameraX) {
            this._cameraPosition.x = maxCameraX;
        }
        if (this._cameraPosition.x < 0) {
            this._cameraPosition.x = 0;
        }
        if (this._cameraPosition.y > maxCameraY) {
            this._cameraPosition.y = maxCameraY;
        }
    }
}
