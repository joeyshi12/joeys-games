import {Sketch} from "./sketch";
import * as p5 from "p5";

export class PlatformerSketch extends Sketch {
  public override preload(sketch: p5): void {
    sketch.textFont(sketch.loadFont(""))
  }

  public override setUp(sketch: p5): void {
    const canvas = sketch.createCanvas(400, 400);
    canvas.parent("canvas");
  }

  public override mouseMoved(sketch: p5): void {

  }

  public override mouseClicked(sketch: p5): void {

  }

  public override keyPressed(sketch: p5): void {

  }

  public override keyReleased(sketch: p5): void {

  }

  public draw(sketch: p5): void {
    console.log("draw");
    sketch.background(0);
    sketch.rect(100, 100, 100, 100);
  }
}
