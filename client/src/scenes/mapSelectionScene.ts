import {Scene} from "./scene";
import Game from "../game";
import {StageMap} from "./stage";

export default class MapSelectionScene extends Scene {
    public constructor(game: Game, private readonly _maps: StageMap[]) {
        super(game);
    }

    public update() {
        this.game.renderer.drawMapList(this._maps);
    }
}