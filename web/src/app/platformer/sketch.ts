import * as p5 from "p5";

export abstract class Sketch {
  public initSketch(): p5 {
    return new p5(this.writeSketchContext.bind(this));
  }

  protected preload(context: p5): void {}

  protected setUp(context: p5): void {}

  protected windowResized(context: p5): void {}

  protected mouseMoved(context: p5): void {}

  protected mouseClicked(context: p5): void {}

  protected keyPressed(context: p5): void {}

  protected keyReleased(context: p5): void {}

  protected abstract draw(context: p5): void;

  private writeSketchContext(context: p5): void {
    context.preload = () => this.preload(context);
    context.setup = () => this.setUp(context);
    context.windowResized = () => this.windowResized(context);
    context.mouseMoved = () => this.mouseMoved(context);
    context.mouseClicked = () => this.mouseClicked(context);
    context.keyPressed = () => this.keyPressed(context);
    context.keyReleased = () => this.keyReleased(context);
    context.draw = () => this.draw(context);
  }
}
