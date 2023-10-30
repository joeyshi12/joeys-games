import {Scene} from "./scenes/scene";
import {Renderer} from "./renderer";
import {loadSpriteSheet, loadFont} from "./loadAssets";
import LoginScene from "./scenes/loginScene";
import {Point} from "./scenes/gui";
import {Socket} from "socket.io-client";
import {loadAudioBuffer, Sound} from "./sound";

export default class Game {
    private _scene: Scene;
    private _sounds: Map<string, Sound>;
    private readonly nextFrame = this._gameLoop.bind(this);

    public constructor(public readonly renderer: Renderer,
                       public readonly socket: Socket) {
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

    /**
     * Load images and sound files
     */
    public async preload(): Promise<void> {
        const [spriteSheet, fontFace, clickSound, jumpSound, landSound] = await Promise.all([
            loadSpriteSheet("/images/spritesheet.png", 22, 48),
            loadFont("Inconsolata", "/fonts/inconsolata.otf"),
            loadAudioBuffer("/sounds/click.mp3"),
            loadAudioBuffer("/sounds/jump.mp3"),
            loadAudioBuffer("/sounds/land.mp3")
        ]);
        this.renderer.spriteSheet = spriteSheet;
        document.fonts.add(fontFace);
        this._sounds = new Map([
            ["click", new Sound(clickSound)],
            ["jump", new Sound(jumpSound)],
            ["land", new Sound(landSound)]
        ]);
    }

    public start(canvas: HTMLCanvasElement): void {
        this._scene = new LoginScene(this);

        window.addEventListener("keydown", (event: KeyboardEvent) => {
            this._scene.keyPressed(event);
        });
        window.addEventListener("keyup", (event: KeyboardEvent) => {
            this._scene.keyReleased(event);
        });
        canvas.addEventListener("mousemove", (event: MouseEvent) => {
            this._scene.mouseMoved(this._getMousePosition(canvas, event));
        });
        canvas.addEventListener("mousedown", (event: MouseEvent) => {
            this._scene.mouseClicked(this._getMousePosition(canvas, event));
        });
        window.addEventListener("resize", () => {
            this.renderer.resizeCanvas();
        });

        requestAnimationFrame(this.nextFrame);
    }

    private _gameLoop(): void {
        this._scene.update();
        requestAnimationFrame(this.nextFrame);
    }

    private _getMousePosition(canvas: HTMLCanvasElement, event: MouseEvent): Point {
        const rect = canvas.getBoundingClientRect();
        return {
            x: (event.clientX - rect.left) / Renderer.CONTEXT_SCALE,
            y: (event.clientY - rect.top) / Renderer.CONTEXT_SCALE
        };
    }
}
