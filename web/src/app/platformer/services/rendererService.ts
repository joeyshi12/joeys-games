import * as p5 from "p5";
import { Injectable } from "@angular/core";
import { EntityMetadata, Vector } from "../../../../../src/types/entityMetadata";
import { Stage } from "../scenes/stage";

/**
 * Service to render sprites from sprite sheet
 */
@Injectable()
export class RendererService {
  public static SPRITE_LENGTH: number = 36;
  public static SHEET_CELL_LENGTH: number = 16;
  public static SHEET_ROWS: number = 22;
  public static SHEET_COLS: number = 48;
  private _spriteSheet: p5.Image;
  private _focusedEntity: EntityMetadata;

  constructor() {}

  public set spriteSheet(val: p5.Image) {
    this._spriteSheet = val;
  }

  public set focusedEntity(entity: EntityMetadata) {
    this._focusedEntity = entity;
  }

  public renderStage(context: p5, stage: Stage): void {
    for (let i = 0; i < stage.mapData.cols; i++) {
      for (let j = 0; j < stage.mapData.rows; j++) {
        const tileIdx = i * stage.mapData.rows + j;
        const spriteId = stage.mapData.spriteData[tileIdx];
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
        if (stage.mapData.collisionSolidData[tileIdx]) {
          context.push();
          context.noFill();
          context.strokeWeight(1);
          context.stroke(0, 255, 0);
          context.rect(
            j * RendererService.SPRITE_LENGTH + offset.x,
            i * RendererService.SPRITE_LENGTH + offset.y,
            RendererService.SPRITE_LENGTH,
            RendererService.SPRITE_LENGTH
          );
          context.pop();
        }
        if (stage.mapData.collisionPlatformData[tileIdx]) {
          context.push();
          context.noFill();
          context.strokeWeight(1);
          context.stroke(0, 0, 255);
          context.rect(
              j * RendererService.SPRITE_LENGTH + offset.x,
              i * RendererService.SPRITE_LENGTH + offset.y,
              RendererService.SPRITE_LENGTH,
              RendererService.SPRITE_LENGTH
          );
          context.pop();
        }
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

  public renderEntity(context: p5, entity: EntityMetadata): void {
    const row = Math.floor(entity.spriteIndex / RendererService.SHEET_COLS);
    const col = entity.spriteIndex % RendererService.SHEET_COLS;
    const offset = this._getWindowOffset(context);
    context.push();
    if (entity.isFlipped) {
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
    context.pop();
  }

  private _getWindowOffset(context: p5): Vector {
    if (this._focusedEntity) {
      return {
        x: context.width / 2 - this._focusedEntity.position.x,
        y: context.height / 2 - this._focusedEntity.position.y
      };
    } else {
      return { x: 0, y: 0 };
    }
  }
}
