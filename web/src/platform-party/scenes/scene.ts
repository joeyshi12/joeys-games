import PlatformPartyManager from "../platformPartyManager";

export abstract class Scene {
    protected constructor(protected manager: PlatformPartyManager) {
    }

    public abstract draw(): void;

    public update(): void {
        // Do nothing
    }

    public mouseMove(event: MouseEvent): void {
        // Do nothing
    }

    public mouseDown(event: MouseEvent): void {
        // Do nothing
    }

    public mouseUp(event: MouseEvent): void {
        // Do nothing
    }

    public wheel(event: WheelEvent): void {
        // Do nothing
    }

    public keyDown(event: KeyboardEvent): void {
        // Do nothing
    }

    public keyUp(event: KeyboardEvent): void {
        // Do nothing
    }

    public message(event: MessageEvent): void {
        // Do nothing
    }
}
