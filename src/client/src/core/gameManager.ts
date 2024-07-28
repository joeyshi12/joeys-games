export default abstract class GameManager {
    public readonly ctx: CanvasRenderingContext2D;
    private _previousTimeStamp: number;
    private readonly _nextLoop: (timeStamp: number) => void = this._gameLoop.bind(this);

    public constructor(parentSelector: string,
                       public readonly framePeriod: number) {
        const parentElement = document.querySelector(parentSelector);
        if (!parentElement) {
            throw new Error(`Missing parent element ${parentSelector}`);
        }
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d", {alpha: false});
        if (!context) {
            throw new Error("2D canvas rendering context is not supported by the browser");
        }
        parentElement.appendChild(canvas);
        this.ctx = context;
    }

    public start(): void {
        this.setUp().then(() => {
            this._startLoop();
        });
    }

    public update(): void {
        // Do nothing
    }

    public abstract draw(): void;

    protected abstract setUp(): Promise<void>;

    private _startLoop(): void {
        requestAnimationFrame((timeStamp: number) => {
            this._previousTimeStamp = timeStamp;
            requestAnimationFrame(this._gameLoop.bind(this));
        });
    }

    private _gameLoop(timeStamp: number): void {
        const elapsedTime = timeStamp - this._previousTimeStamp;
        if (elapsedTime > this.framePeriod) {
            this._previousTimeStamp = timeStamp;
            this.update();
            this.draw();
        }
        requestAnimationFrame(this._nextLoop);
    }
}
