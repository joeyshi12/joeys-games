import * as p5 from "p5";
import {Drawable} from "../../../../../src/transfers/drawable";
import { Injectable } from "@angular/core";

/**
 * Service to render sprites from sprite sheet
 */
@Injectable({
  providedIn: 'root'
})
export class RendererService {
  public static SPRITE_LENGTH = 36;
  public static SHEET_CELL_LENGTH = 16;
  public static SHEET_ROWS = 22;
  public static SHEET_COLS = 48;
  private _spriteSheet: p5.Image;

  public set spriteSheet(val: p5.Image) {
    this._spriteSheet = val;
  }

  public renderStage(sketch: p5): void {
    sketch.background(0);
  }

  public renderDrawable(sketch: p5, drawable: Drawable): void {
    const row = Math.floor(drawable.spriteIndex / RendererService.SHEET_COLS);
    const col = drawable.spriteIndex % RendererService.SHEET_COLS;
    sketch.image(
      this._spriteSheet,
      drawable.position.x,
      drawable.position.y,
      RendererService.SPRITE_LENGTH,
      RendererService.SPRITE_LENGTH,
      col * RendererService.SHEET_CELL_LENGTH,
      row * RendererService.SHEET_CELL_LENGTH,
      RendererService.SHEET_CELL_LENGTH,
      RendererService.SHEET_CELL_LENGTH
    );
  }
}
