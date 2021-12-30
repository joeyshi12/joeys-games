import { Vector } from "../../../../../src/types/entityMetadata";

export class Button {
  public width: number;

  constructor(public text: string,
              public position: Vector,
              public callback: () => void) {
    this.width = text.length * 16;
  }

  public isHovered(mouseX: number, mouseY: number): boolean {
    if (this.position.x < mouseX && mouseX < this.position.x + this.width) {
      if (this.position.y < mouseY && mouseY < this.position.y + 20) {
        return true;
      }
    }
    return false;
  }
}
