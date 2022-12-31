import {Scene} from "./scenes/scene";
import {Renderer} from "./renderer";
import {loadSpriteSheet} from "./spriteSheet";
import SoundPlayer from "./soundPlayer";
import Login from "./scenes/login";
import Hub from "./scenes/hub";

export default class Game {
    private _scene: Scene;
    private readonly nextFrame = this._gameLoop.bind(this);

    public constructor(public readonly renderer: Renderer,
                       public readonly soundPlayer: SoundPlayer) {
        this._scene = new Hub(this);
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

        window.addEventListener("keydown", (event: KeyboardEvent) => {
            this._scene.keyPressed(event);
        });
        window.addEventListener("keyup", (event: KeyboardEvent) => {
            this._scene.keyReleased(event);
        });
        window.addEventListener("mousedown", (event: MouseEvent) => {
            this._scene.mouseClicked(event);
        });
        window.addEventListener("resize", () => {
            this.renderer.resizeCanvas();
        });

        this._loadAssets().then(() => {
            requestAnimationFrame(this.nextFrame);
        });
    }

    public get scene() {
        return this._scene;
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
        this.renderer.spriteSheet = await loadSpriteSheet("assets/spritesheet.png", 22, 48);
        await Promise.all([
            this.soundPlayer.loadSound("assets/click.mp3", "click"),
            this.soundPlayer.loadSound("assets/jump.mp3", "jump"),
            this.soundPlayer.loadSound("assets/land.mp3", "land"),
        ]);
    }
}