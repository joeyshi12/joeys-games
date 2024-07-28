import { Scene } from "./scenes/scene";
import { Renderer, CONTEXT_SCALE } from "./renderer";
import { loadSpriteSheet, loadFont } from "./loadAssets";
import LoginScene from "./scenes/loginScene";
import { Socket } from "socket.io-client";
import GameManager from "../core/gameManager";
import { loadSound, Sound } from "../core/sound";
import { Point } from "./scenes/gui";

export default class PlatformPartyManager extends GameManager {
    public readonly renderer: Renderer;
    private _scene: Scene;
    private _sounds: Map<string, Sound>;

    public constructor(parentSelector: string,
                       public readonly socket: Socket) {
        super(parentSelector, 16);
        this.renderer = new Renderer();
        this.renderer.context = this.ctx;
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

    protected override async setUp(): Promise<void> {
        const [spriteSheet, fontFace, clickSound, jumpSound, landSound] = await Promise.all([
            loadSpriteSheet("/images/spritesheet.png", 22, 48),
            loadFont("Inconsolata", "/fonts/inconsolata.otf"),
            loadSound("/sounds/click.mp3"),
            loadSound("/sounds/jump.mp3"),
            loadSound("/sounds/land.mp3")
        ]);
        this.renderer.spriteSheet = spriteSheet;
        this.renderer.resizeCanvas();
        document.fonts.add(fontFace);
        this._sounds = new Map([
            ["click", clickSound],
            ["jump", jumpSound],
            ["land", landSound]
        ]);
        this._scene = new LoginScene(this);
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
            this._scene.keyPressed(event);
        });
        window.addEventListener("keyup", (event: KeyboardEvent) => {
            this._scene.keyReleased(event);
        });
        window.addEventListener("resize", () => {
            this.renderer.resizeCanvas();
        });
        canvas.addEventListener("mousemove", (event: MouseEvent) => {
            this._scene.mouseMoved(this._getMousePosition(canvas, event));
        });
        canvas.addEventListener("mousedown", (event: MouseEvent) => {
            this._scene.mouseClicked(this._getMousePosition(canvas, event));
        });
    }

    private _getMousePosition(canvas: HTMLCanvasElement, event: MouseEvent): Point {
        const rect = canvas.getBoundingClientRect();
        return {
            x: (event.clientX - rect.left) / CONTEXT_SCALE,
            y: (event.clientY - rect.top) / CONTEXT_SCALE
        };
    }
}
