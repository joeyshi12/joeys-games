import PlatformPartyManager from "../platformPartyManager";
import { Point } from "./gui";

export abstract class Scene {
    protected constructor(protected manager: PlatformPartyManager) {}

    public abstract draw(): void;

    public update(): void {
        // Do nothing
    }

    public mouseMoved(point: Point): void {
        // Do nothing
    }

    public mouseClicked(point: Point): void {
        // Do nothing
    }

    public keyPressed(event: KeyboardEvent): void {
        // Do nothing
    }

    public keyReleased(event: KeyboardEvent): void {
        // Do nothing
    }
}
