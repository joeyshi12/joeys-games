export class TextElement {
    public constructor(private readonly _ctx: CanvasRenderingContext2D,
                       public text: string,
                       public x: number,
                       public y: number,
                       public fontSize: number) {
    }

    public draw(): void {
        this._ctx.save();
        this._ctx.fillStyle = "#fff";
        this._ctx.font = `${this.fontSize}px "Inconsolata"`;
        this._ctx.fillText(this.text, this.x, this.y);
        this._ctx.restore();
    }
}

export class TextInputElement {
    public height: number;
    public text: string = "";
    public isFocused: boolean = false;
    private _horizontalPadding: number = 4;

    public constructor(private _ctx: CanvasRenderingContext2D,
                       public x: number,
                       public y: number,
                       public width: number,
                       public fontSize: number) {
        this.height = fontSize + 8;
    }

    public mouseDown(point: Point): void {
        if (point.x < this.x || point.x > this.x + this.width
            || point.y < this.y || point.y > this.y + this.height) {
            this.isFocused = false;
            return;
        }
        this.isFocused = true;
    }

    public draw(): void {
        this._ctx.save();
        this._ctx.font = `${this.fontSize}px "Arial"`;
        this._ctx.fillStyle = "#FFF";
        this._ctx.fillRect(this.x, this.y, this.width, this.height);

        if (this.isFocused) {
            this._ctx.lineWidth = 2; 
            this._ctx.strokeStyle = "#4400FF";
            this._ctx.strokeRect(this.x, this.y, this.width, this.height);
        }

        let startIndex = this.text.length - 1;
        let textWidth = this._horizontalPadding * 2;
        while (startIndex > 0) {
            textWidth += this._ctx.measureText(this.text.charAt(startIndex)).width;
            if (textWidth > this.width) break;
            startIndex--;
        }
        const displayText = this.text.slice(startIndex);
        this._ctx.fillStyle = "#000";
        this._ctx.fillText(displayText, this.x + this._horizontalPadding, this.y + this.fontSize);
        this._ctx.restore();
    }
}

export class ButtonElement {
    public isHovered: boolean = false;

    public constructor(private readonly _ctx: CanvasRenderingContext2D,
                       public text: string,
                       public x: number,
                       public y: number,
                       public width: number,
                       public height: number,
                       public fontSize: number) {
    }

    public get textX(): number {
        return this.x + (this.width - this._ctx.measureText(this.text).width) / 2;
    }

    public get textY(): number {
        return this.y + this.height / 2;
    }

    public mouseMove(point: Point): void {
        if (point.x < this.x || point.x > this.x + this.width
            || point.y < this.y || point.y > this.y + this.height) {
            this.isHovered = false;
            return;
        }
        this.isHovered = true;
    }

    public draw(): void {
        this._ctx.save();
        this._ctx.fillStyle = "#444";
        this._ctx.textBaseline = "middle";
        this._ctx.fillRect(this.x, this.y, this.width, this.height);
        this._ctx.font = `${this.fontSize}px "Inconsolata"`;
        this._ctx.fillStyle = "#FFF";
        if (this.isHovered) {
            this._ctx.font = `${this.fontSize + 2}px "Inconsolata"`;
        }
        this._ctx.fillText(this.text, this.textX, this.textY);
        this._ctx.restore();
    }
}

export type Point = {
  x: number;
  y: number;
}
