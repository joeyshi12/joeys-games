export default class Food {
    constructor(private _ctx: CanvasRenderingContext2D,
                public posX: number,
                public posY: number,
                private _sprite: HTMLImageElement,
                private _unitLength: number) {
    }

    public draw() {
        this._ctx.drawImage(
            this._sprite,
            this.posX * this._unitLength,
            this.posY * this._unitLength,
            this._unitLength,
            this._unitLength
        );
    }

    public updatePosition(x: number, y: number) {
        this.posX = x;
        this.posY = y;
    }
}
