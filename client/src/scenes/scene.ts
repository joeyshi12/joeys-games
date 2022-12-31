import Game from "../game";

export abstract class Scene {
  protected constructor(protected game: Game) {}

  public mouseMoved(): void {};

  public mouseClicked(event: MouseEvent): void {};

  public keyPressed(event: KeyboardEvent): void {};

  public keyReleased(event: KeyboardEvent): void {};

  public update(): void {};
}
