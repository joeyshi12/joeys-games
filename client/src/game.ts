import {Scene} from "./scenes/scene";
import {Renderer} from "./renderer";
import {loadSpriteSheet, loadFont} from "./loadAssets";
import SoundPlayer from "./soundPlayer";
import Login from "./scenes/login";
import {Point} from "./scenes/gui";
import {Socket} from "socket.io-client";
import {ControlledPlayer} from "./entities/controlledPlayer";

export default class Game {
    private _player: ControlledPlayer;
    private _scene: Scene;
    private readonly nextFrame = this._gameLoop.bind(this);

    public constructor(public readonly renderer: Renderer,
                       public readonly soundPlayer: SoundPlayer,
                       public readonly socket: Socket) {
    }

    public start(): void {
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d", {alpha: false});
        if (!context) {
            throw new Error("2d context is not supported by browser");
        }
        this.renderer.context = context;
        document.body.appendChild(canvas);
        this.renderer.resizeCanvas();

        this._loadAssets().then(() => {
            this._scene = new Login(this);

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
        });
    }

    public get controlledPlayer(): ControlledPlayer {
        return this._player;
    }

    public set controlledPlayer(val: ControlledPlayer) {
        this._player = val;
    }

    public set scene(val: Scene) {
        this._scene = val;
    }

    private _gameLoop(): void {
        this._scene.update();
        requestAnimationFrame(this.nextFrame);
    }

    /**
     * Load images and sound files
     * @private
     */
    private async _loadAssets(): Promise<void> {
        const fontFace = await loadFont("Inconsolata", "assets/inconsolata.otf");
        document.fonts.add(fontFace);
        this.renderer.spriteSheet = await loadSpriteSheet("assets/spritesheet.png", 22, 48);
        await Promise.all([
            this.soundPlayer.loadSound("assets/click.mp3", "click"),
            this.soundPlayer.loadSound("assets/jump.mp3", "jump"),
            this.soundPlayer.loadSound("assets/land.mp3", "land"),
        ]);
    }

    private _getMousePosition(canvas: HTMLCanvasElement, event: MouseEvent): Point {
        const rect = canvas.getBoundingClientRect();
        return {
            x: (event.clientX - rect.left) / Renderer.CONTEXT_SCALE,
            y: (event.clientY - rect.top) / Renderer.CONTEXT_SCALE
        };
    }
}
