export default class Game {
    private readonly nextFrame = this._gameLoop.bind(this);

    public constructor() {
    }

    public start(): void {
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d", {alpha: false});
        if (!context) {
            throw new Error("2d context is not supported by browser");
        }
        document.body.appendChild(canvas);

        this._loadAssets().then(() => {
            window.addEventListener("keydown", (event: KeyboardEvent) => {
            });
            window.addEventListener("keyup", (event: KeyboardEvent) => {
            });
            canvas.addEventListener("mousemove", (event: MouseEvent) => {
            });
            canvas.addEventListener("mousedown", (event: MouseEvent) => {
            });
            window.addEventListener("resize", () => {
            });
            requestAnimationFrame(this.nextFrame);
        });
    }

    private _gameLoop(): void {
        // TODO: update game
        requestAnimationFrame(this.nextFrame);
    }

    private async _loadAssets(): Promise<void> {
    }
}
