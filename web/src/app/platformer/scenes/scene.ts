import * as p5 from "p5";
import {PlatformerSketch} from "../platformerSketch";

export abstract class Scene {
  protected constructor(protected _sketch: PlatformerSketch) {}

  public mouseMoved(context: p5): void {};

  public mouseClicked(context: p5): void {};

  public keyPressed(context: p5): void {};

  public keyReleased(context: p5): void {};

  public abstract draw(context: p5): void;
}
