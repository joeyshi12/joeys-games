import * as p5 from "p5";
import { EntityMetadata, PlayerMetadata, Vector } from "../../../server/types/entityMetadata";
import { TextElement } from "../scenes/gui";
import { StageService } from "./stageService";

/**
 * Service to render sprites from sprite sheet
 */
export class RendererService {
  public static SPRITE_LENGTH: number = 36;
  public static SHEET_CELL_LENGTH: number = 16;
  public static SHEET_ROWS: number = 22;
  public static SHEET_COLS: number = 48;
  private _spriteSheet: p5.Image;
  private _focusedEntity?: EntityMetadata;

  constructor(private _stageService: StageService) {}

  public set spriteSheet(val: p5.Image) {
    this._spriteSheet = val;
  }

  public set focusedEntity(entity: EntityMetadata) {
    this._focusedEntity = entity;
  }

  public renderStage(context: p5): void {
    const mapData = this._stageService.currentStage.mapData;
    for (let i = 0; i < mapData.rows; i++) {
      for (let j = 0; j < mapData.cols; j++) {
        const tileIdx = i * mapData.cols + j;
        const spriteId = mapData.spriteData[tileIdx];
        const offset = this._getWindowOffset(context);
        context.image(
          this._spriteSheet,
          j * RendererService.SPRITE_LENGTH + offset.x,
          i * RendererService.SPRITE_LENGTH + offset.y,
          RendererService.SPRITE_LENGTH,
          RendererService.SPRITE_LENGTH,
          (spriteId % RendererService.SHEET_COLS) * RendererService.SHEET_CELL_LENGTH,
          Math.floor(spriteId / RendererService.SHEET_COLS) * RendererService.SHEET_CELL_LENGTH,
          15,
          16
        );
        // if (mapData.solidIndices.has(tileIdx)) {
        //   context.push();
        //   context.noFill();
        //   context.strokeWeight(1);
        //   context.stroke(0, 255, 0);
        //   context.rect(
        //     j * RendererService.SPRITE_LENGTH + offset.x,
        //     i * RendererService.SPRITE_LENGTH + offset.y,
        //     RendererService.SPRITE_LENGTH,
        //     RendererService.SPRITE_LENGTH
        //   );
        //   context.pop();
        // }
        // if (mapData.platformIndices.has(tileIdx)) {
        //   context.push();
        //   context.noFill();
        //   context.strokeWeight(1);
        //   context.stroke(0, 0, 255);
        //   context.rect(
        //     j * RendererService.SPRITE_LENGTH + offset.x,
        //     i * RendererService.SPRITE_LENGTH + offset.y,
        //     RendererService.SPRITE_LENGTH,
        //     RendererService.SPRITE_LENGTH
        //   );
        //   context.pop();
        // }
      }
    }
  }

  /**
   * Renders boundary of given entity's collision box
   * @param context
   * @param entity
   */
  public renderEntityCollisionBox(context: p5, entity: EntityMetadata): void {
    const offset = this._getWindowOffset(context);
    context.push();
    context.noFill();
    context.strokeWeight(1);
    context.stroke(0, 255, 0);
    context.rect(
      entity.position.x + entity.collisionBox.offset.x + offset.x,
      entity.position.y + entity.collisionBox.offset.y + offset.y,
      entity.collisionBox.width,
      entity.collisionBox.height
    );
    context.pop();
  }

  public renderTextElement(context: p5, element: TextElement, v1: number, v2: number, v3: number): void {
    context.push();
    context.fill(v1, v2, v3);
    context.textSize(element.textSize);
    context.text(
      element.text,
      element.position.x,
      element.position.y,
      element.position.x + element.width,
      element.position.y + element.height
    );
    context.pop();
  }

  public renderNeighboringTiles(context: p5, entity: EntityMetadata): void {
    const offset = this._getWindowOffset(context);

    const x = entity.position.x + entity.collisionBox.offset.x;
    const y = entity.position.y + entity.collisionBox.offset.y;
    const topRow = Math.floor(y / RendererService.SPRITE_LENGTH);
    const leftCol = Math.floor(x / RendererService.SPRITE_LENGTH);
    const rightCol = Math.floor((x + entity.collisionBox.width) / RendererService.SPRITE_LENGTH);
    const bottomRow = Math.floor((y + entity.collisionBox.height) / RendererService.SPRITE_LENGTH);
    context.push();
    context.noFill();
    context.strokeWeight(1);
    context.stroke(0, 255, 0);
    context.rect(
        leftCol * RendererService.SPRITE_LENGTH + offset.x,
        topRow * RendererService.SPRITE_LENGTH + offset.y,
        RendererService.SPRITE_LENGTH,
        RendererService.SPRITE_LENGTH
    );
    context.rect(
        rightCol * RendererService.SPRITE_LENGTH + offset.x,
        topRow * RendererService.SPRITE_LENGTH + offset.y,
        RendererService.SPRITE_LENGTH,
        RendererService.SPRITE_LENGTH
    );
    context.rect(
        leftCol * RendererService.SPRITE_LENGTH + offset.x,
        bottomRow * RendererService.SPRITE_LENGTH + offset.y,
        RendererService.SPRITE_LENGTH,
        RendererService.SPRITE_LENGTH
    );
    context.rect(
        rightCol * RendererService.SPRITE_LENGTH + offset.x,
        bottomRow * RendererService.SPRITE_LENGTH + offset.y,
        RendererService.SPRITE_LENGTH,
        RendererService.SPRITE_LENGTH
    );
    context.pop();
  }

  public renderPlayer(context: p5, player: PlayerMetadata): void {
    this.renderEntity(context, player);
    const offset = this._getWindowOffset(context);
    offset.x += player.collisionBox.width / 2 - player.name.length * 3.5 + 4;
    context.push();
    context.fill(255);
    context.textSize(14);
    context.text(
      player.name,
      player.position.x + offset.x,
      player.position.y + offset.y
    );
    context.pop();
  }

  public renderEntity(context: p5, entity: EntityMetadata): void {
    const row = Math.floor(entity.spriteIndex / RendererService.SHEET_COLS);
    const col = entity.spriteIndex % RendererService.SHEET_COLS;
    const offset = this._getWindowOffset(context);
    if (entity.isFlipped) {
      context.push();
      context.scale(-1, 1)
      context.image(
          this._spriteSheet,
           -(entity.position.x + offset.x + RendererService.SPRITE_LENGTH),
          entity.position.y + offset.y,
          RendererService.SPRITE_LENGTH,
          RendererService.SPRITE_LENGTH,
          col * RendererService.SHEET_CELL_LENGTH,
          row * RendererService.SHEET_CELL_LENGTH,
          RendererService.SHEET_CELL_LENGTH,
          RendererService.SHEET_CELL_LENGTH
      );
      context.pop();
    } else {
      context.image(
          this._spriteSheet,
          entity.position.x + offset.x,
          entity.position.y + offset.y,
          RendererService.SPRITE_LENGTH,
          RendererService.SPRITE_LENGTH,
          col * RendererService.SHEET_CELL_LENGTH,
          row * RendererService.SHEET_CELL_LENGTH,
          RendererService.SHEET_CELL_LENGTH,
          RendererService.SHEET_CELL_LENGTH
      );
    }
  }

  private _getWindowOffset(context: p5): Vector {
    if (this._focusedEntity) {
      const mapData = this._stageService.currentStage.mapData;

      let x = context.width / 2 - this._focusedEntity.position.x;
      if (x > 0) {
        x = 0;
      } else if (2 * (mapData.cols * RendererService.SPRITE_LENGTH - this._focusedEntity.position.x) < context.windowWidth) {
        x = context.width - mapData.cols * RendererService.SPRITE_LENGTH;
      }

      let y = context.height / 2 - this._focusedEntity.position.y;
      if (2 * (mapData.rows * RendererService.SPRITE_LENGTH - this._focusedEntity.position.y) < context.windowHeight) {
        y = context.height - mapData.rows * RendererService.SPRITE_LENGTH;
      }

      return {x, y};
    } else {
      return { x: 0, y: 0 };
    }
  }
}
