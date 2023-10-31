import { Sound } from "./sound";

export default class Snake {
    public isDead = false;
    private _dx = 0;
    private _dy = 0;
    private _posX: number[] = [5, 4, 3];
    private _posY: number[] = [10, 10, 10];

    constructor(private _ctx: CanvasRenderingContext2D,
                private _nameInputElement: HTMLInputElement,
                private _submitButtonElement: HTMLButtonElement,
                private _growSound: Sound,
                private _gridSize: number,
                private _unitLength: number) {
    }

    public draw() {
        if (!this.isDead) {
            this.isDead = this._hasCollided();
            if (this.isDead) {
                this._nameInputElement.disabled = false;
                this._submitButtonElement.disabled = false;
            }
        }

        if (!this.isStationary() && !this.isDead) {
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
        const dirX = this._posX[0] - this._posX[1];
        const dirY = this._posY[0] - this._posY[1];
        if (dirX * dx < 0 || dirY * dy < 0) {
            return;
        }
        this._dx = dx;
        this._dy = dy;
    }

    public grow() {
        this._growSound.play();
        this._posX.push(2 * this._posX[this.size - 1] - this._posX[this.size - 2]);
        this._posY.push(2 * this._posY[this.size - 1] - this._posY[this.size - 2]);
    }

    public isStationary() {
        return this._dx === 0 && this._dy === 0;
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

    public contains(x: number, y: number) {
        for (let i = 0; i < this.size; i++) {
            if (this._posX[i] === x && this._posY[y] === y) {
                return true;
            }
        }
        return false;
    }
}
