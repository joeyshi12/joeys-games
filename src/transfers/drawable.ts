export interface Vector {
  x: number;
  y: number;
}

export interface Drawable {
  position: Vector;
  spriteIndex: number;
  isFlipped: boolean;
}
