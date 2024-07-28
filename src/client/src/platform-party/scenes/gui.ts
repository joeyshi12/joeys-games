export type Point = {
  x: number;
  y: number;
}

export class TextElement {
    public constructor(private _ctx: CanvasRenderingContext2D,
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
    public text: string = "";

    public constructor(private _ctx: CanvasRenderingContext2D,
                       public x: number,
                       public y: number,
                       public width: number,
                       public fontSize: number) {
    }

    public draw(): void {
        this._ctx.save();
        this._ctx.font = `${this.fontSize}px "Arial"`;
        this._ctx.fillStyle = "#fff";
        this._ctx.fillRect(
            this.x,
            this.y,
            this.width,
            this.fontSize + 4 // vertical padding below
        );

        const padding = 8;
        let startIndex = this.text.length - 1;
        let textWidth = 2 * padding;
        while (startIndex > 0) {
            textWidth += this._ctx.measureText(this.text.charAt(startIndex)).width;
            if (textWidth > this.width) break;
            startIndex--;
        }
        const displayText = this.text.slice(startIndex);
        this._ctx.fillStyle = "#000";
        this._ctx.fillText(displayText, this.x + padding, this.y + this.fontSize);
        this._ctx.restore();
    }
}

export class ButtonElement {
    public isHovered: boolean = false;

    public constructor(private _ctx: CanvasRenderingContext2D,
                       public text: string,
                       public x: number,
                       public y: number,
                       public width: number,
                       public height: number,
                       public fontSize: number) {
    }

    public get centerX(): number {
        return this.x + (this.width - this._ctx.measureText(this.text).width) / 2;
    }

    public mouseMoved(point: Point): void {
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
        this._ctx.fillRect(this.x, this.y, this.width, this.height);
        this._ctx.font = `${this.fontSize}px "Inconsolata"`;
        this._ctx.fillStyle = "#fff";
        if (this.isHovered) {
            this._ctx.font = `${this.fontSize + 2}px "Inconsolata"`;
        }
        this._ctx.fillText(this.text, this.centerX, this.y + this.fontSize);
        this._ctx.restore();
    }
}
