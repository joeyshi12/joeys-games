import { MouseInteractiveElement, Point } from "./guiElement";

const DEFAULT_FONT_SIZE = 16;
const HOVER_FONT_SIZE_DELTA = 2;

export class ButtonElement extends MouseInteractiveElement {
    public constructor(private readonly _ctx: CanvasRenderingContext2D,
                       public text: string,
                       x: number,
                       y: number,
                       width: number,
                       height: number,
                       private _callback: () => void,
                       public fontSize: number = DEFAULT_FONT_SIZE) {
        super(x, y, width, height);
    }

    public get textX(): number {
        return this.x + (this.width - this._ctx.measureText(this.text).width) / 2;
    }

    public get textY(): number {
        return this.y + this.height / 2;
    }

    public override draw(ctx: CanvasRenderingContext2D): void {
        ctx.save();
        ctx.fillStyle = "#444";
        ctx.textBaseline = "middle";
        ctx.fillRect(this.x, this.y, this.width, this.height);
        ctx.font = `${this.fontSize}px "Inconsolata"`;
        ctx.fillStyle = "#FFF";
        if (this._isHovered) {
            ctx.font = `${this.fontSize + HOVER_FONT_SIZE_DELTA}px "Inconsolata"`;
        }
        ctx.fillText(this.text, this.textX, this.textY);
        ctx.restore();
    }

    public override mouseDown(point: Point): boolean {
        if (!this._isHovered) {
            return false;
        }
        this._callback();
        return true;
    }
}
