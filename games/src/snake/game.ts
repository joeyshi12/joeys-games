import Snake from "./snake";
import Food from "./food";

export default class Game {
    private previousTimeStamp: number;

    public constructor(private _ctx: CanvasRenderingContext2D,
                       private _snake: Snake,
                       private _food: Food,
                       private _gridSize: number,
                       private _length: number) {
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
        // Draw a frame every 80 ms
        if (elapsedTime > 80) {
            this._draw();
            this.previousTimeStamp = timeStamp;
        }
        requestAnimationFrame(this._gameLoop.bind(this));
    }

    private _draw() {
        this._ctx.fillStyle = "#fff";
        this._ctx.fillRect(0, 0, this._ctx.canvas.width, this._ctx.canvas.height);
        this._food.draw();
        this._snake.draw();
        if (this._snake.isHeadAtPos(this._food.posX, this._food.posY)) {
            this._snake.grow();
            this._food.updatePosition();
        }
        this._ctx.fillStyle = "#000";
        for (let i = 1; i < this._gridSize; i++) {
            const offset = i * this._length - 1;
            this._ctx.fillRect(offset, 0, 1, this._ctx.canvas.height);
            this._ctx.fillRect(0, offset, this._ctx.canvas.width, 1);
        }
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
