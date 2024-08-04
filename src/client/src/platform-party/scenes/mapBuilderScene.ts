import PlatformPartyManager from "../platformPartyManager"
import { Point } from "./gui";
import { Scene } from "./scene"

export default class MapBuilderScene extends Scene {
    private _translation: Point = { x: 0, y: 0 };
    private _scale: number = 1;
    private _mouseDownPosition?: Point;
    private _mouseOverPosition?: Point;

    public constructor(manager: PlatformPartyManager) {
        super(manager);
    }

    public get currentTranslation(): Point {
        let { x, y } = this._translation;
        if (this._mouseDownPosition && this._mouseOverPosition) {
            x += this._mouseOverPosition.x - this._mouseDownPosition.x;
            y += this._mouseOverPosition.y - this._mouseDownPosition.y;
        }
        return { x, y };
    }

    public override mouseDown(event: MouseEvent): void {
        this._mouseDownPosition = {
            x: event.clientX,
            y: event.clientY
        };
    }

    public override mouseMove(event: MouseEvent): void {
        this._mouseOverPosition = {
            x: event.clientX,
            y: event.clientY
        };
    }

    public override mouseUp(_: MouseEvent): void {
        this._translation = this.currentTranslation;
        this._mouseDownPosition = undefined;
        this._mouseOverPosition = undefined;
    }

    public override wheel(event: WheelEvent): void {
        event.preventDefault();
        const { x: mouseX, y: mouseY } = this.manager.getWorldMousePosition(event);

        // https://d3js.org/d3-zoom#zoom_wheelDelta
        const wheelDelta = -event.deltaY * (event.deltaMode === 1 ? 0.05 : event.deltaMode ? 1 : 0.002) * (event.ctrlKey ? 10 : 1);
        const scaleFactor = Math.pow(2, wheelDelta);

        const { x: translateX, y: translateY } = this.currentTranslation;
        this._translation.x -= (mouseX - translateX) * (scaleFactor - 1);
        this._translation.y -= (mouseY - translateY) * (scaleFactor - 1);
        this._scale *= scaleFactor;
    }

    public override draw() {
        this.manager.ctx.save();
        this.manager.ctx.fillStyle = "#1C1C1C";
        this.manager.ctx.fillRect(0, 0, this.manager.ctx.canvas.width, this.manager.ctx.canvas.height);
        const { x: translateX, y: translateY } = this.currentTranslation;
        this.manager.ctx.setTransform(this._scale, 0, 0, this._scale, translateX, translateY);
        this.manager.ctx.fillStyle = "#333";
        this.manager.ctx.fillRect(0, 0, 100, 100);
        this.manager.ctx.restore();
    }
}
