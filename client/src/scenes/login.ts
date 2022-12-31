import {Scene} from "./scene";
import Game from "../game";

export default class Login extends Scene {
    public constructor(game: Game) {
        super(game);
        this._initGui();
    }

    public update() {
        this.game.renderer.context.font = "50px serif";
        this.game.renderer.context.fillStyle = "#ffffff";
        this.game.renderer.context.fillText("AYO WTF", 0, 0);
    }

    private _initGui() {
    }
}