import * as p5 from "p5";

export abstract class Sketch {
  constructor() {}

  public initSketch(): p5 {
    return new p5(this.writeSketchContext.bind(this));
  }

  public preload(sketch: p5): void {};

  public setUp(sketch: p5): void {}

  public mouseMoved(sketch: p5): void {};

  public mouseClicked(sketch: p5): void {};

  public keyPressed(sketch: p5): void {};

  public keyReleased(sketch: p5): void {};

  abstract draw(sketch: p5): void;

  private writeSketchContext(sketch: p5): void {
    sketch.preload = () => this.preload(sketch);
    sketch.setup = () => this.setUp(sketch);
    sketch.mouseMoved = () => this.mouseMoved(sketch);
    sketch.mouseClicked = () => this.mouseClicked(sketch);
    sketch.keyPressed = () => this.keyPressed(sketch);
    sketch.keyReleased = () => this.keyReleased(sketch);
    sketch.draw = () => this.draw(sketch);
  }
}
