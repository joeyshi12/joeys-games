import { MouseInteractiveElement, Point } from "./guiElement";

const DEFAULT_FONT_SIZE = 16;

export class TextInputElement extends MouseInteractiveElement {
    public text: string = "";
    public isFocused: boolean = false;
    private _horizontalPadding: number = 4;

    public constructor(x: number, y: number, width: number, public fontSize: number = DEFAULT_FONT_SIZE) {
        super(x, y, width, fontSize + 8);
    }

    public override mouseDown(point: Point): boolean {
        if (!this._isHovered) {
            this.isFocused = false;
            return false;
        }
        this.isFocused = !this.isFocused;
        return true;
    }

    public override draw(ctx: CanvasRenderingContext2D): void {
        ctx.save();
        ctx.font = `${this.fontSize}px "Arial"`;
        ctx.fillStyle = "#FFF";
        ctx.fillRect(this.x, this.y, this.width, this.height);

        if (this.isFocused) {
            ctx.lineWidth = 2; 
            ctx.strokeStyle = "#4400FF";
            ctx.strokeRect(this.x, this.y, this.width, this.height);
        }

        let startIndex = this.text.length - 1;
        let textWidth = this._horizontalPadding * 2;
        while (startIndex > 0) {
            textWidth += ctx.measureText(this.text.charAt(startIndex)).width;
            if (textWidth > this.width) break;
            startIndex--;
        }
        const displayText = this.text.slice(startIndex);
        ctx.fillStyle = "#000";
        ctx.fillText(displayText, this.x + this._horizontalPadding, this.y + this.fontSize);
        ctx.restore();
    }
}

