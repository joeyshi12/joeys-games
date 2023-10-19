import Snake from "./snake";

export default class Game {
    private previousTimeStamp: number;

    public constructor(private _ctx: CanvasRenderingContext2D,
                       private _snake: Snake) {
    }

    public start(): void {
        this._ctx.fillStyle = "#fff";
        this._ctx.fillRect(0, 0, this._ctx.canvas.width, this._ctx.canvas.height);
        this._loadAssets().then(() => {
            window.addEventListener("keydown", this._handleKeyDown.bind(this));
            requestAnimationFrame((timeStamp: number) => {
                this.previousTimeStamp = timeStamp;
                requestAnimationFrame(this._gameLoop.bind(this));
            });
        });
    }

    private _gameLoop(timeStamp: number): void {
        const elapsedTime = timeStamp - this.previousTimeStamp;
        // Draw a frame every 100 ms
        if (elapsedTime > 100) {
            this._draw();
            this.previousTimeStamp = timeStamp;
        }
        requestAnimationFrame(this._gameLoop.bind(this));
    }

    private _draw() {
        this._ctx.fillStyle = "#fff";
        this._ctx.fillRect(0, 0, this._ctx.canvas.width, this._ctx.canvas.height);
        this._snake.update();
    }

    private _handleKeyDown(event: KeyboardEvent) {
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
    }

    private async _loadAssets(): Promise<void> {
    }
}
