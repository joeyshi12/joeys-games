import { Scene } from "./scenes/scene";
import { loadSpriteSheet, loadFont, SpriteSheet } from "./loadAssets";
import MenuScene from "./scenes/menuScene";
import GameManager from "../core/gameManager";
import { loadSound, Sound } from "../core/sound";
import { Point } from "./scenes/gui/guiElements";

export default class PlatformPartyManager extends GameManager {
    public spriteSheet: SpriteSheet;
    private _scene: Scene;
    private _sounds: Map<string, Sound>;

    public constructor(parentSelector: string) {
        super(parentSelector, 16);
    }

    public set scene(val: Scene) {
        this._scene = val;
    }

    public getSound(key: string): Sound {
        const sound = this._sounds.get(key);
        if (!sound) {
            throw new Error(`Invalid sound key ${key}`);
        }
        return sound;
    }

    public getWorldMousePosition(event: MouseEvent): Point {
        const rect = this.ctx.canvas.getBoundingClientRect();
        return {
            x: event.clientX - rect.left,
            y: event.clientY - rect.top
        };
    }

    protected override async setUp(): Promise<void> {
        this._resizeCanvas();
        const [spriteSheet, fontFace, clickSound, jumpSound, landSound] = await Promise.all([
            loadSpriteSheet("/images/spritesheet.png", 22, 48),
            loadFont("Inconsolata", "/fonts/inconsolata.otf"),
            loadSound("/sounds/click.mp3"),
            loadSound("/sounds/jump.mp3"),
            loadSound("/sounds/land.mp3")
        ]);
        this.spriteSheet = spriteSheet;
        document.fonts.add(fontFace);
        this._sounds = new Map([
            ["click", clickSound],
            ["jump", jumpSound],
            ["land", landSound]
        ]);
        this._scene = new MenuScene(this);
        this._initEventListeners();
    }

    protected override update() {
        this._scene.update();
    }

    protected override draw() {
        this._scene.draw();
    }

    private _initEventListeners(): void {
        const canvas = this.ctx.canvas;
        window.addEventListener("keydown", (event: KeyboardEvent) => {
            this._scene.keyDown(event);
        });
        window.addEventListener("keyup", (event: KeyboardEvent) => {
            this._scene.keyUp(event);
        });
        window.addEventListener("resize", () => {
            this._resizeCanvas();
        });
        canvas.addEventListener("mousemove", (event: MouseEvent) => {
            this._scene.mouseMove(event);
        });
        canvas.addEventListener("mousedown", (event: MouseEvent) => {
            this._scene.mouseDown(event);
        });
        canvas.addEventListener("mouseup", (event: MouseEvent) => {
            this._scene.mouseUp(event);
        });
        canvas.addEventListener("wheel", (event: WheelEvent) => {
            this._scene.wheel(event);
        })
    }

    private _resizeCanvas(): void {
        this.ctx.canvas.width = Math.min(1000, window.innerWidth);
        this.ctx.canvas.height = Math.min(600, window.innerHeight);
    }
}
