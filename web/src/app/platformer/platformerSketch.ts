import * as p5 from "p5";
import { RendererService } from "./services/rendererService";
import { Scene } from "./scenes/scene";
import { PlayerDataService } from "./services/playerDataService";
import { StageService } from "./services/stageService";
import { Menu } from "./scenes/menu";
import "p5/lib/addons/p5.sound";
import { SoundPlayerService } from "./services/soundPlayerService";

export class PlatformerSketch {
  private _scene: Scene;
  private _font: p5.Font;
  private _spriteSheet: p5.Image;

  constructor(private _playerDataService: PlayerDataService,
              private _rendererService: RendererService,
              private _soundPlayerService: SoundPlayerService,
              private _stageService: StageService) {
    this._scene = new Menu(this);
  }

  public get playerDataService(): PlayerDataService {
    return this._playerDataService;
  }

  public get rendererService(): RendererService {
    return this._rendererService;
  }

  public get soundPlayerService(): SoundPlayerService {
    return this._soundPlayerService;
  }

  public get stageService(): StageService {
    return this._stageService;
  }

  public set scene(val: Scene) {
    this._scene = val;
  }

  public initSketch(): p5 {
    const that = this;
    return new p5((context: p5) => {
      context.preload = () => that._preload(context);
      context.setup = () => that._setUp(context);
      context.windowResized = () => that._windowResized(context);
      context.mouseMoved = () => that._mouseMoved(context);
      context.mouseClicked = () => that._mouseClicked(context);
      context.keyPressed = () => that._keyPressed(context);
      context.keyReleased = () => that._keyReleased(context);
      context.draw = () => that._draw(context);
    });
  }

  private _preload(context: p5): void {
    this._font = context.loadFont("assets/inconsolata.otf");
    this._spriteSheet = context.loadImage("assets/spritesheet.png");
    this._soundPlayerService.soundFiles = {
      click: new p5.SoundFile("assets/click.mp3"),
      pause: new p5.SoundFile("assets/pause.mp3"),
      jump: new p5.SoundFile("assets/jump.mp3"),
      land: new p5.SoundFile("assets/land.mp3")
    };
  }

  private _setUp(context: p5): void {
    context.textFont(this._font);
    this._rendererService.spriteSheet = this._spriteSheet;
    const canvas = context.createCanvas(context.windowWidth, context.windowHeight);
    canvas.parent("canvas");
    context.frameRate(60);
  }

  private _windowResized(context: p5): void {
    context.resizeCanvas(context.windowWidth, context.windowHeight);
  }

  private _mouseMoved(context: p5): void {
    this._scene.mouseMoved(context);
  }

  private _mouseClicked(context: p5): void {
    this._scene.mouseClicked(context);
  }

  private _keyPressed(context: p5): void {
    this._scene.keyPressed(context);
  }

  private _keyReleased(context: p5): void {
    this._scene.keyReleased(context);
  }

  private _draw(context: p5): void {
    this._scene.draw(context);
  }
}
