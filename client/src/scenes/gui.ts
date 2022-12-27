import { Vector } from "../../../src/types/entityMetadata";

export class TextElement {
  public readonly width: number;

  constructor(public text: string,
              public readonly textSize: number,
              public position: Vector) {
    this.width = text.length * textSize / 2;
  }

  public get height(): number {
    return this.textSize;
  }
}

export class Button {
  public element: TextElement;

  constructor(text: string,
              textSize: number,
              position: Vector,
              public callback: () => void) {
    this.element = new TextElement(text, textSize, position);
  }

  public isHovered(mouseX: number, mouseY: number): boolean {
    if (this.element.position.x < mouseX && mouseX < this.element.position.x + this.element.width) {
      if (this.element.position.y < mouseY && mouseY < this.element.position.y + this.element.height) {
        return true;
      }
    }
    return false;
  }
}
