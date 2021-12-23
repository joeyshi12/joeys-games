export interface Position {
  x: number;
  y: number;
}

export interface Drawable {
  position: Position;
  spriteIndex: number;
  isFlipped: boolean;
}
