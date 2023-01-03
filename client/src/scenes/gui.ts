export type Point = {
  x: number;
  y: number;
}

export type TextElement = {
  x: number;
  y: number;
  text: string;
  fontSize: number;
}

export type TextInput = TextElement & {
  width: number;
}

export type Button = TextElement & {
  width: number;
  height: number;
  isHovered: boolean;
}

export function updateIsHovered(button: Button, point: Point): void {
    if (point.x < button.x || point.x > button.x + button.width
      || point.y < button.y || point.y > button.y + button.height) {
        button.isHovered = false;
        return;
    }
    button.isHovered = true;
}
