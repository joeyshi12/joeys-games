import PlatformPartyManager from "../platformPartyManager";
import { GUIElement } from "./gui";

export abstract class Scene {
    private _guiElements: GUIElement[] = [];

    protected constructor(protected manager: PlatformPartyManager) {
    }

    public abstract draw(): void;

    public update(): void {
        // Do nothing
    }

    public mouseMove(event: MouseEvent): void {
        const point = this.manager.getWorldMousePosition(event);
        for (let element of this._guiElements) {
            element.mouseMove(point);
        }
        this.onMouseMove(event);
    }

    public mouseDown(event: MouseEvent): void {
        const point = this.manager.getWorldMousePosition(event);
        for (let element of this._guiElements) {
            element.mouseDown(point);
        }
        this.onMouseDown(event);
    }

    public mouseUp(event: MouseEvent): void {
        // Do nothing
    }

    public wheel(event: WheelEvent): void {
        // Do nothing
    }

    public keyDown(event: KeyboardEvent): void {
        for (let element of this._guiElements) {
            element.keyDown(event);
        }
        this.onKeyDown(event);
    }

    public keyUp(event: KeyboardEvent): void {
        // Do nothing
    }

    protected onMouseMove(event: MouseEvent): void {
        // Do nothing
    }

    protected onMouseDown(event: MouseEvent): void {
        // Do nothing
    }

    protected onKeyDown(event: KeyboardEvent): void {
        // Do nothing
    }

    protected addGUIElement(element: GUIElement): void {
        this._guiElements.push(element);
    }
}
