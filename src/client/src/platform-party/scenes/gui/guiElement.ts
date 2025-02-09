export interface GuiElement {
    draw(ctx: CanvasRenderingContext2D): void;
}

export abstract class MouseInteractiveElement implements GuiElement {
    protected _isHovered: boolean = false;

    protected constructor(public x: number,
                          public y: number,
                          public width: number,
                          public height: number) {
    }

    public abstract draw(ctx: CanvasRenderingContext2D): void;

    public abstract mouseDown(point: Point): boolean;

    public get isHovered(): boolean {
        return this._isHovered;
    }

    public mouseMove(point: Point): void {
        this._isHovered = this._contains(point);
    }

    private _contains(point: Point): boolean {
        return point.x >= this.x && point.x <= this.x + this.width
            && point.y >= this.y && point.y <= this.y + this.height;
    }
}

export type Point = {
  x: number;
  y: number;
};
