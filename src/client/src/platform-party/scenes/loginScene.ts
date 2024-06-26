import { Scene } from "./scene";
import Game from "../game";
import { Button, Point, TextElement, TextInput, updateIsHovered } from "./gui";
import { MapData, PlayerMetadata } from "../../../../models/platformPartyModels";
import { Player } from "../entities/player";
import { StageMap } from "./stage";
import StageScene from "./stageScene";

export default class LoginScene extends Scene {
    private readonly _titleElement: TextElement;
    private readonly _textInput: TextInput;
    private readonly _loginButton: Button;

    public constructor(game: Game) {
        super(game);
        this._titleElement = {
            x: 150,
            y: 100,
            text: "Platform Party",
            fontSize: 16,
        };
        this._textInput = {
            x: 150,
            y: 130,
            text: "",
            fontSize: 12,
            width: 120
        };
        this._loginButton = {
            x: 145,
            y: 160,
            text: "Login",
            fontSize: 12,
            width: 42,
            height: 16,
            isHovered: false
        };
        this.game.socket.on("joinSuccess", (metadata: PlayerMetadata) => {
            this._fetchDefaultMap().then((stageMap: StageMap) => {
                const player = new Player(
                    metadata,
                    this.game.getSound("jump"),
                    this.game.getSound("land")
                );
                this.game.socket.removeAllListeners("joinSuccess");
                this.game.socket.removeAllListeners("joinFailure");
                this.game.scene = new StageScene(this.game, stageMap, player);
            });
        });
        this.game.socket.on("joinError", (msg: string) => {
            alert(msg);
        });
    }

    public mouseMoved(point: Point) {
        updateIsHovered(this._loginButton, point);
    }

    public mouseClicked(point: Point) {
        if (this._loginButton.isHovered) {
            this.game.getSound("click").play();
            this.game.socket.emit("login", this._textInput.text);
        }
    }

    public keyPressed(event: KeyboardEvent) {
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
        this.game.renderer.drawButton(this._loginButton);
    }

    private async _fetchDefaultMap(): Promise<StageMap> {
        const mapDataRepository: MapData[] = await (await fetch("/platform-party/maps")).json();
        const mapData = mapDataRepository.find((map) => map.name === "default")
            ?? mapDataRepository[0];
        return {
            rows: mapData.rows,
            columns: mapData.columns,
            spriteData: mapData.spriteData,
            solidIndices: new Set(mapData.solidIndices),
            platformIndices: new Set(mapData.platformIndices)
        };
    }

    keyReleased(event: KeyboardEvent): void {}
}
