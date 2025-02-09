import { GuiElement } from "./guiElement";

const DEFAULT_FONT_SIZE = 16;

export class TextElement implements GuiElement {
    public constructor(public text: string,
                       public x: number,
                       public y: number,
                       public fontSize: number = DEFAULT_FONT_SIZE) {
    }

    public draw(ctx: CanvasRenderingContext2D): void {
        ctx.save();
        ctx.fillStyle = "#fff";
        ctx.font = `${this.fontSize}px "Inconsolata"`;
        ctx.fillText(this.text, this.x, this.y);
        ctx.restore();
    }
}

