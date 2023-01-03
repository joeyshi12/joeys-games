import {PlayerMetadata, Vector} from "../../src/types/entityMetadata";
import {Stage} from "./scenes/stage";
import {SpriteSheet} from "./loadAssets";
import {Button, TextElement, TextInput} from "./scenes/gui";


export class Renderer {
  public static readonly CONTEXT_SCALE: number = 2;
  public static readonly SPRITE_LENGTH: number = 16;

  private _cameraPosition: Vector;
  private _context: CanvasRenderingContext2D;
  private _spriteSheet: SpriteSheet;

  public constructor() {
    this._cameraPosition = {x: 0, y: 0};
  }

  public set context(val: CanvasRenderingContext2D) {
    this._context = val;
  }

  public set spriteSheet(val: SpriteSheet) {
    this._spriteSheet = val;
  }

  public resizeCanvas() {
    this._context.canvas.width = Math.min(1200, window.innerWidth);
    this._context.canvas.height = Math.min(700, window.innerHeight);
    this._context.scale(Renderer.CONTEXT_SCALE, Renderer.CONTEXT_SCALE);
  }

  public fill(color: string): void {
    this._context.fillStyle = color;
    this._context.fillRect(0, 0, this._context.canvas.width, this._context.canvas.height);
    this._context.fillRect(0, 0, this._context.canvas.width, this._context.canvas.height);
  }

  public drawPlayer(entity: PlayerMetadata) {
    this._context.fillStyle = "#ffffff";
    this._context.font = '8px "Inconsolata"';
    const textWidth = this._context.measureText(entity.name).width;
    this._context.fillText(
        entity.name,
        entity.position.x - this._cameraPosition.x - (textWidth - Renderer.SPRITE_LENGTH) / 2,
        entity.position.y - this._cameraPosition.y
    );

    if (entity.isFlipped) {
      this._context.save();
      this._context.translate(2 * (entity.position.x - this._cameraPosition.x) + entity.collisionBox.width, 0);
      this._context.scale(-1, 1);
    }
    this._context.drawImage(
        this._spriteSheet.sprites[entity.spriteIndex],
        Math.floor(entity.position.x - this._cameraPosition.x),
        Math.floor(entity.position.y - this._cameraPosition.y),
        this._spriteSheet.cellLength,
        this._spriteSheet.cellLength
    );
    if (entity.isFlipped) {
      this._context.restore();
    }
  }

  public drawStage(stage: Stage) {
    this.fill("#1C1C1C");
    const mapData = stage.mapData;
    const cellLength = this._spriteSheet.cellLength;
    for (let i = 0; i < mapData.rows; i++) {
      for (let j = 0; j < mapData.cols; j++) {
        const tileIdx = i * mapData.cols + j;
        const spriteId = mapData.spriteData[tileIdx];
        this._context.drawImage(
            this._spriteSheet.sprites[spriteId],
            Math.floor(j * cellLength - this._cameraPosition.x),
            Math.floor(i * cellLength - this._cameraPosition.y),
            cellLength,
            cellLength
        );
      }
    }
  }

  public updateCameraPosition(focalPoint: Vector, stage: Stage): void {
    const canvas = this._context.canvas;
    this._cameraPosition.x = focalPoint.x - canvas.width / (2 * Renderer.CONTEXT_SCALE);
    this._cameraPosition.y = focalPoint.y - canvas.height / (2 * Renderer.CONTEXT_SCALE);

    const mapWidth = stage.mapData.cols * this._spriteSheet.cellLength;
    const mapHeight = stage.mapData.rows * this._spriteSheet.cellLength;
    if (this._cameraPosition.x > mapWidth - canvas.width / 2) {
      this._cameraPosition.x = mapWidth - canvas.width / 2;
    }
    if (this._cameraPosition.x < 0) {
      this._cameraPosition.x = 0;
    }
    if (this._cameraPosition.y > mapHeight - canvas.height / 2) {
      this._cameraPosition.y = mapHeight - canvas.height / 2;
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
      buttonLeft -= 2
    }
    this._context.fillText(button.text, buttonLeft, button.y + button.fontSize);
    this._context.restore();
  }
}
