export default class Snake {
    public isDead = false;
    private _dx = 1;
    private _dy = 0;
    private _positions_x: number[] = [5, 4, 3];
    private _positions_y: number[] = [10, 10, 10];
    private _size = 3;

    constructor(private _ctx: CanvasRenderingContext2D,
                private _unitLength: number) {
    }

    public update() {
        this._positions_x.unshift(this._positions_x[0] + this._dx);
        this._positions_y.unshift(this._positions_y[0] + this._dy);
        this._positions_x.pop();
        this._positions_y.pop();
        this._ctx.fillStyle = "black";
        for (let i = 0; i < this._size; i++) {
            this._ctx.fillRect(
                this._positions_x[i],
                this._positions_y[i],
                this._unitLength,
                this._unitLength
            );
        }
    }

    public setDirection(dx: number, dy: number) {
        this._dx = dx;
        this._dy = dy;
    }

    public grow() {
        this._positions_x.push(2 * this._positions_x[this._size - 1] - this._positions_x[this._size - 2]);
        this._positions_y.push(2 * this._positions_y[this._size - 1] - this._positions_y[this._size - 2]);
        this._size++;
    }

    public checkCollide() {
        for (let i = 1; i < this._size; i++) {
            if (this._positions_x[0] === this._positions_x[i] && this._positions_y[0] === this._positions_y[i]) {
                return true;
            }
        }
        return this._positions_x[0] === 0 || this._positions_x[0] === this._size - 1 || this._positions_y[0] === 0 || this._positions_y[0] === this._size - 1;
    }
}
