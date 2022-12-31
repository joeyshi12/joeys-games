import {PlayerMetadata, Vector} from "../../src/types/entityMetadata";
import {Stage} from "./scenes/stage";
import {SpriteSheet} from "./spriteSheet";


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

  public drawPlayer(entity: PlayerMetadata) {
    if (entity.isFlipped) {
      this._context.save();
      this._context.translate(this._context.canvas.width / 2 + entity.collisionBox.width, 0);
      this._context.scale(-1, 1);
    }
    this._context.drawImage(
        this._spriteSheet.sprites[entity.spriteIndex],
        Math.floor(entity.position.x + this._cameraPosition.x),
        Math.floor(entity.position.y + this._cameraPosition.y),
        this._spriteSheet.cellLength,
        this._spriteSheet.cellLength
    );
    if (entity.isFlipped) {
      this._context.restore();
    }
  }

  public drawStage(stage: Stage) {
    this._context.fillStyle = "#1C1C1C";
    this._context.fillRect(0, 0, this._context.canvas.width, this._context.canvas.height);
    this._context.fillRect(0, 0, this._context.canvas.width, this._context.canvas.height);

    const mapData = stage.mapData;
    const cellLength = this._spriteSheet.cellLength;
    for (let i = 0; i < mapData.rows; i++) {
      for (let j = 0; j < mapData.cols; j++) {
        const tileIdx = i * mapData.cols + j;
        const spriteId = mapData.spriteData[tileIdx];
        this._context.drawImage(
            this._spriteSheet.sprites[spriteId],
            Math.floor(j * cellLength + this._cameraPosition.x),
            Math.floor(i * cellLength + this._cameraPosition.y),
            cellLength,
            cellLength
        );
      }
    }
  }

  public updateCameraPosition(focalPoint: Vector): void {
    const canvas = this._context.canvas;
    this._cameraPosition.x = canvas.width / (2 * Renderer.CONTEXT_SCALE) - focalPoint.x;
    this._cameraPosition.y = canvas.height / (2 * Renderer.CONTEXT_SCALE) - focalPoint.y;
  }
}
