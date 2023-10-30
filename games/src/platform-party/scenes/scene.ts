import Game from "../game";
import {Point} from "./gui";
import {Sound} from "../sound";

export abstract class Scene {
    protected constructor(protected game: Game) {}

    public abstract mouseMoved(point: Point): void

    public abstract mouseClicked(point: Point): void

    public abstract keyPressed(event: KeyboardEvent): void

    public abstract keyReleased(event: KeyboardEvent): void

    public abstract update(): void
}
