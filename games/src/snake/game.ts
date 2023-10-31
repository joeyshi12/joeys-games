import Snake from "./snake";
import Food from "./food";

export default class Game {
    private _previousTimeStamp: number;

    public constructor(private _ctx: CanvasRenderingContext2D,
                       private _scoreElement: HTMLSpanElement,
                       private _snake: Snake,
                       private _food: Food,
                       private _gridSize: number,
                       private _length: number) {
    }

    public start(): void {
        this._ctx.fillStyle = "#fff";
        this._ctx.fillRect(0, 0, this._ctx.canvas.width, this._ctx.canvas.height);
        window.addEventListener("keydown", this._handleKeyDown.bind(this));
        requestAnimationFrame((timeStamp: number) => {
            this._previousTimeStamp = timeStamp;
            requestAnimationFrame(this._gameLoop.bind(this));
        });
    }

    public get score(): number {
        return this._snake.size - 3;
    }

    private _gameLoop(timeStamp: number): void {
        const elapsedTime = timeStamp - this._previousTimeStamp;
        // Draw a frame every 80 ms
        if (elapsedTime > 80) {
            this._draw();
            this._previousTimeStamp = timeStamp;
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
            this._setNextFoodPosition();
            this._updateScoreText();
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
            case "arrowup":
                this._snake.setDirection(0, -1);
                break;
            case "a":
            case "arrowleft":
                this._snake.setDirection(-1, 0);
                break;
            case "s":
            case "arrowdown":
                this._snake.setDirection(0, 1);
                break;
            case "d":
            case "arrowright":
                this._snake.setDirection(1, 0);
                break;
        }
    }

    private _setNextFoodPosition() {
        const numCells = this._gridSize * this._gridSize;
        const shift = Math.floor(Math.random() * numCells);
        for (let pos = 0; pos < numCells; pos++) {
            const nextPos = (pos + shift) % numCells;
            const x = nextPos % this._gridSize;
            const y = Math.floor(nextPos / this._gridSize);
            if (!this._snake.contains(x, y)) {
                this._food.updatePosition(x, y);
                break;
            }
        }
    }

    private _updateScoreText() {
        this._scoreElement.textContent = String(this.score);
    }
}
