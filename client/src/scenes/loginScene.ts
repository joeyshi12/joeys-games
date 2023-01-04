import {Scene} from "./scene";
import Game from "../game";
import {Button, Point, TextElement, TextInput, updateIsHovered} from "./gui";
import StageScene from "./stageScene";
import {PlayerMetadata} from "../../../src/types/playerMetadata";
import {Player} from "../entities/player";

export default class LoginScene extends Scene {
    private readonly _titleElement: TextElement;
    private readonly _textInput: TextInput;
    private readonly _submitButton: Button;

    public constructor(game: Game) {
        super(game);
        this._titleElement = {
            x: 100,
            y: 100,
            text: "Platform Party",
            fontSize: 16,
        };
        this._textInput = {
            x: 100,
            y: 130,
            text: "",
            fontSize: 12,
            width: 120
        };
        this._submitButton = {
            x: 95,
            y: 160,
            text: "Login",
            fontSize: 12,
            width: 42,
            height: 16,
            isHovered: false
        };
        this.game.socket.on("joinSuccess", (metadata: PlayerMetadata) => {
            if (!this.game.player) {
                this.game.player = new Player(
                    metadata,
                    this.game.getSound("jump"),
                    this.game.getSound("land")
                );
                this.game.socket.removeAllListeners("joinSuccess");
                this.game.socket.removeAllListeners("joinFailure");
                this.game.scene = new StageScene(this.game);
            }
        });
        this.game.socket.on("joinError", (msg: string) => {
            alert(msg);
        });
    }

    public mouseMoved(point: Point) {
        updateIsHovered(this._submitButton, point);
    }

    public mouseClicked(point: Point) {
        if (this._submitButton.isHovered) {
            this.game.socket.emit("login", this._textInput.text);
        }
    }

    public keyPressed(event: KeyboardEvent) {
        console.log(event.key);
        if (event.key === "Enter") {
            this.game.socket.emit("login", this._textInput.text);
        } else if (event.key === "Backspace") {
            this._textInput.text = this._textInput.text.substring(0, this._textInput.text.length - 1);
        } else if (event.key.length === 1 && event.key !== " ") {
            this._textInput.text = this._textInput.text.concat(event.key);
        }
    }

    public update() {
        this.game.renderer.fill("#1C1C1C");
        this.game.renderer.drawText(this._titleElement);
        this.game.renderer.drawTextInput(this._textInput);
        this.game.renderer.drawButton(this._submitButton);
    }
}
