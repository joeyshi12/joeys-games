import { Scene } from "./scene";
import PlatformPartyManager from "../platformPartyManager";
import { ButtonElement, Point, TextElement, TextInputElement } from "./gui";
import { MapData, PlayerMetadata } from "../../../../models/platformPartyModels";
import { Player } from "../entities/player";
import { StageMap } from "./stage";
import StageScene from "./stageScene";

export default class LoginScene extends Scene {
    private _titleElement: TextElement;
    private _textInput: TextInputElement;
    private _startButton: ButtonElement;

    public constructor(manager: PlatformPartyManager) {
        super(manager);
        this._initGUIElements();
        this.manager.socket.on("joinSuccess", (metadata: PlayerMetadata) => {
            this._fetchDefaultMap().then((stageMap: StageMap) => {
                const player = new Player(
                    metadata,
                    this.manager.getSound("jump"),
                    this.manager.getSound("land")
                );
                this.manager.socket.removeAllListeners("joinSuccess");
                this.manager.socket.removeAllListeners("joinFailure");
                this.manager.scene = new StageScene(this.manager, stageMap, player);
            });
        });
        this.manager.socket.on("joinError", (msg: string) => {
            alert(msg);
        });
    }

    public override mouseMoved(point: Point) {
        this._startButton.mouseMoved(point);
    }

    public override mouseClicked(point: Point) {
        if (this._startButton.isHovered) {
            this.manager.getSound("click").play();
            this.manager.socket.emit("login", this._textInput.text);
        }
        this._textInput.mouseClicked(point);
    }

    public override keyPressed(event: KeyboardEvent) {
        if (this._textInput.isFocused) {
            if (event.key === "Enter") {
                this.manager.socket.emit("login", this._textInput.text);
            } else if (event.key === "Backspace") {
                this._textInput.text = this._textInput.text.substring(0, this._textInput.text.length - 1);
            } else if (event.key.length === 1 && event.key !== " ") {
                this._textInput.text = this._textInput.text.concat(event.key);
            }
        }
    }

    public override draw() {
        const ctx = this.manager.ctx;
        ctx.fillStyle = "#1C1C1C";
        ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        this._titleElement.draw();
        this._textInput.draw();
        this._startButton.draw();
    }

    private _initGUIElements(): void {
        this._titleElement = new TextElement(this.manager.ctx, "Platform Party", 120, 100, 32);
        this._textInput = new TextInputElement(this.manager.ctx, 120, 140, 200, 20);
        this._startButton = new ButtonElement(this.manager.ctx, "Start", 120, 180, 100, 32, 20);
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
}
