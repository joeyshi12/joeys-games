import Snake from "./snake";

export default class Game {
    private readonly nextFrame = this._gameLoop.bind(this);

    public constructor(private _snake: Snake) {
    }

    public start(): void {
        this._loadAssets().then(() => {
            window.addEventListener("keydown", (event: KeyboardEvent) => {
                switch (event.key.toLowerCase()) {
                    case "w":
                        this._snake.setDirection(0, -1);
                        break;
                    case "a":
                        this._snake.setDirection(-1, 0);
                        break;
                    case "s":
                        this._snake.setDirection(0, 1);
                        break;
                    case "d":
                        this._snake.setDirection(1, 0);
                        break;
                }
            });
            window.addEventListener("keyup", (event: KeyboardEvent) => {
            });
            window.addEventListener("resize", () => {
            });
            requestAnimationFrame(this.nextFrame);
        });
    }

    private _gameLoop(): void {
        this._snake.update();
        requestAnimationFrame(this.nextFrame);
    }

    private async _loadAssets(): Promise<void> {
    }
}
