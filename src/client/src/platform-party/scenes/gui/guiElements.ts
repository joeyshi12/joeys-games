export class TextElement {
    public constructor(private readonly _ctx: CanvasRenderingContext2D,
                       private readonly _text: string,
                       private readonly _x: number,
                       private readonly _y: number,
                       private readonly _fontSize: number) {
    }

    public draw(): void {
        this._ctx.save();
        this._ctx.fillStyle = "#fff";
        this._ctx.font = `${this._fontSize}px "Inconsolata"`;
        this._ctx.fillText(this._text, this._x, this._y);
        this._ctx.restore();
    }
}

export class TextInputElement {
    public height: number;
    public text: string = "";
    public isFocused: boolean = false;
    private _horizontalPadding: number = 4;

    public constructor(private _ctx: CanvasRenderingContext2D,
                       private _x: number,
                       private _y: number,
                       private _width: number,
                       private _fontSize: number) {
        this.height = _fontSize + 8;
    }

    public mouseDown(point: Point): void {
        if (point.x < this._x || point.x > this._x + this._width
            || point.y < this._y || point.y > this._y + this.height) {
            this.isFocused = false;
            return;
        }
        this.isFocused = true;
    }

    public draw(): void {
        this._ctx.save();
        this._ctx.font = `${this._fontSize}px "Arial"`;
        this._ctx.fillStyle = "#FFF";
        this._ctx.fillRect(this._x, this._y, this._width, this.height);

        if (this.isFocused) {
            this._ctx.lineWidth = 2; 
            this._ctx.strokeStyle = "#4400FF";
            this._ctx.strokeRect(this._x, this._y, this._width, this.height);
        }

        let startIndex = this.text.length - 1;
        let textWidth = this._horizontalPadding * 2;
        while (startIndex > 0) {
            textWidth += this._ctx.measureText(this.text.charAt(startIndex)).width;
            if (textWidth > this._width) break;
            startIndex--;
        }
        const displayText = this.text.slice(startIndex);
        this._ctx.fillStyle = "#000";
        this._ctx.fillText(displayText, this._x + this._horizontalPadding, this._y + this._fontSize);
        this._ctx.restore();
    }
}

export class ButtonElement {
    public isHovered: boolean = false;

    public constructor(private readonly _ctx: CanvasRenderingContext2D,
                       private readonly _text: string,
                       private readonly _x: number,
                       private readonly _y: number,
                       private readonly _width: number,
                       private readonly _height: number,
                       private readonly _fontSize: number) {
    }

    public get textX(): number {
        return this._x + (this._width - this._ctx.measureText(this._text).width) / 2;
    }

    public get textY(): number {
        return this._y + this._height / 2;
    }

    public mouseMove(point: Point): void {
        if (point.x < this._x || point.x > this._x + this._width
            || point.y < this._y || point.y > this._y + this._height) {
            this.isHovered = false;
            return;
        }
        this.isHovered = true;
    }

    public draw(): void {
        this._ctx.save();
        this._ctx.fillStyle = "#444";
        this._ctx.textBaseline = "middle";
        this._ctx.fillRect(this._x, this._y, this._width, this._height);
        this._ctx.font = `${this._fontSize}px "Inconsolata"`;
        this._ctx.fillStyle = "#FFF";
        if (this.isHovered) {
            this._ctx.font = `${this._fontSize + 2}px "Inconsolata"`;
        }
        this._ctx.fillText(this._text, this.textX, this.textY);
        this._ctx.restore();
    }
}

export type Point = {
  x: number;
  y: number;
}
