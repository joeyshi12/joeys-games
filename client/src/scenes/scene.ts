import Game from "../game";
import {Point} from "./gui";

export abstract class Scene {
  protected constructor(protected game: Game) {}

  public mouseMoved(point: Point): void {};

  public mouseClicked(point: Point): void {};

  public keyPressed(event: KeyboardEvent): void {};

  public keyReleased(event: KeyboardEvent): void {};

  public update(): void {};
}
