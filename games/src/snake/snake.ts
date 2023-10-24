export default class Snake {
    public isDead = false;
    private _dx = 1;
    private _dy = 0;
    private _posX: number[] = [5, 4, 3];
    private _posY: number[] = [10, 10, 10];

    constructor(private _ctx: CanvasRenderingContext2D,
                private _gridSize: number,
                private _unitLength: number) {
    }

    public draw() {
        if (!this.isDead) {
            this.isDead = this._hasCollided();
        }

        if (!this.isDead) {
            this._posX.unshift(this._posX[0] + this._dx);
            this._posY.unshift(this._posY[0] + this._dy);
            this._posX.pop();
            this._posY.pop();
        }

        this._ctx.fillStyle = this.isDead ? "#880000" : "#008800";
        for (let i = 0; i < this.size; i++) {
            this._ctx.fillRect(
                this._posX[i] * this._unitLength,
                this._posY[i] * this._unitLength,
                this._unitLength,
                this._unitLength
            );
        }
    }

    public setDirection(dx: number, dy: number) {
        if (this._dx !== 0 && dx === 0) {
            this._dx = 0;
            this._dy = dy;
        } else if (this._dy !== 0 && dy === 0) {
            this._dx = dx;
            this._dy = 0;
        }
    }

    public grow() {
        this._posX.push(2 * this._posX[this.size - 1] - this._posX[this.size - 2]);
        this._posY.push(2 * this._posY[this.size - 1] - this._posY[this.size - 2]);
    }

    private _hasCollided() {
        for (let i = 1; i < this.size; i++) {
            if (this._posX[0] === this._posX[i] && this._posY[0] === this._posY[i]) {
                return true;
            }
        }
        return this._posX[0] < 0
            || this._posX[0] >= this._gridSize
            || this._posY[0] < 0
            || this._posY[0] >= this._gridSize;
    }

    public get size() {
        return this._posX.length;
    }

    public isHeadAtPos(x: number, y: number) {
        return this._posX[0] === x && this._posY[0] === y;
    }
}
