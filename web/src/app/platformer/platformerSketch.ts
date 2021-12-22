import {Sketch} from "./sketch";
import * as p5 from "p5";
import {RendererService} from "./services/rendererService";
import {Lobby} from "./scenes/lobby";
import {Scene} from "./scenes/scene";

interface LoadedAssets {
  font: p5.Font;
  spriteSheet: p5.Image;
}

export class PlatformerSketch extends Sketch {
  private readonly _rendererService: RendererService;
  private _scene: Scene;
  private _assets: LoadedAssets;

  constructor() {
    super();
    this._rendererService = new RendererService();
    this._scene = new Lobby(this);
  }

  public get rendererService(): RendererService {
    return this._rendererService;
  }

  public set scene(val: Scene) {
    this._scene = val;
  }

  protected override preload(context: p5): void {
    this._assets = {
      font: context.loadFont("assets/inconsolata.otf"),
      spriteSheet: context.loadImage("assets/spritesheet.png")
    };
  }

  protected override setUp(context: p5): void {
    context.textFont(this._assets.font);
    this._rendererService.spriteSheet = this._assets.spriteSheet;
    const canvas = context.createCanvas(400, 400);
    canvas.parent("canvas");
    context.frameRate(60);
  }

  protected override mouseMoved(context: p5): void {
    this._scene.mouseMoved(context);
  }

  protected override mouseClicked(context: p5): void {
    this._scene.mouseClicked(context);
  }

  protected override keyPressed(context: p5): void {
    this._scene.keyPressed(context);
  }

  protected override keyReleased(context: p5): void {
    this._scene.keyReleased(context);
  }

  protected draw(context: p5): void {
    this._scene.draw(context);
  }
}
