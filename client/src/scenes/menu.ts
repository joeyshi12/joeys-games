import * as p5 from "p5";
import { PlayerMetadata } from "../../../src/types/entityMetadata";
import { PlatformerSketch } from "../platformerSketch";
import { Scene } from "./scene";
import { Button, TextElement } from "./gui";
import { Lobby } from "./lobby";
import { ControlledPlayer } from "../entities/controlledPlayer";

export class Menu extends Scene {
  private _titleElement: TextElement;
  private _invalidNameElement: TextElement;
  private _joinButton: Button;
  private _userNameInput: p5.Element;

  constructor(sketch: PlatformerSketch) {
    super(sketch);
    this._sketch.socket.on("joinRoomSuccess", (metadata: PlayerMetadata) => {
      if (!this._sketch.playerDataService.controlledPlayer) {
        this._sketch.playerDataService.controlledPlayer = new ControlledPlayer(metadata);
        this._sketch.rendererService.focusedEntity = metadata;
        this._sketch.socket.removeAllListeners("joinRoomSuccess");
        this._sketch.socket.removeAllListeners("joinRoomFailure");
        this._userNameInput.remove();
        this._sketch.scene = new Lobby(sketch);
      }
    });
    this._sketch.socket.on("joinRoomFailure", (msg: string) => {
      if (!this._invalidNameElement) {
        this._invalidNameElement = new TextElement(msg, 16, {x: 0, y: 0});
      } else {
        this._invalidNameElement.text = msg;
      }
    });
    this._titleElement = new TextElement("Platform Party", 32, {x: 0, y: 0});
    this._joinButton = new Button("Join Room", 22, {x: 0, y: 0}, () => {
      this._sketch.soundPlayerService.playClick();
      this._sketch.socket.emit("joinRoom", this._userNameInput.value().toString());
    });
  }

  public override mouseClicked(context: p5): void {
    if (this._joinButton.isHovered(context.mouseX, context.mouseY)) {
      this._joinButton.callback();
    }
  }

  public override draw(context: p5) {
    context.background(24, 24, 24);

    this._titleElement.position = {x: context.windowWidth / 4, y: context.windowHeight / 2 - 100};
    this._joinButton.element.position = {x: context.windowWidth / 4, y: context.windowHeight / 2};
    if (this._invalidNameElement) {
      this._invalidNameElement.position = {x: context.windowWidth / 4, y: context.windowHeight / 2 + 30};
      this._sketch.rendererService.renderTextElement(context, this._invalidNameElement, 255, 0, 0);
    }

    this._sketch.rendererService.renderTextElement(context, this._titleElement, 255, 255, 255);
    const gray = this._joinButton.isHovered(context.mouseX, context.mouseY) ? 255 : 200;
    this._sketch.rendererService.renderTextElement(context, this._joinButton.element, gray, gray, gray);

    if (!this._userNameInput) {
      this._userNameInput = context.createInput("PlayerName", "test");
    }
    this._userNameInput.position(context.windowWidth / 4, context.windowHeight / 2 - 30);
  }
}
