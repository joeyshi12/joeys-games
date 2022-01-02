import * as p5 from "p5";
import { PlayerMetadata } from "../../../../../src/types/entityMetadata";
import { PlatformerSketch } from "../platformerSketch";
import { Scene } from "./scene";
import { Button, TextElement } from "./gui";
import { Lobby } from "./lobby";

export class Menu extends Scene {
  private _titleElement: TextElement;
  private _invalidNameElement: TextElement;
  private _joinButton: Button;
  private _userNameInput: p5.Element;

  constructor(sketch: PlatformerSketch) {
    super(sketch);
    this._titleElement = new TextElement("Platform Party", 32, {x: 0, y: 0});
    this._joinButton = new Button("Join Room", 22, {x: 0, y: 0}, () => {
      if (this._canJoinRoom) {
        this._sketch.playerDataService.joinRoom(this._userNameInput.value().toString());
        this._sketch.scene = new Lobby(sketch);
        this._userNameInput.remove();
      } else {
        if (!this._invalidNameElement) {
          this._invalidNameElement = new TextElement(this._invalidNameMessage, 16, {x: 0, y: 0});
        } else {
          this._invalidNameElement.text = this._invalidNameMessage;
        }
      }
    });
  }

  public override mouseClicked(context: p5): void {
    if (this._joinButton.isHovered(context.mouseX, context.mouseY)) {
      this._joinButton.callback();
    }
  }

  public override draw(context: p5) {
    context.background(24, 24, 24);

    this._sketch.playerDataService.getPlayers();
    this._titleElement.position = {x: context.windowWidth / 4, y: context.windowHeight / 2 - 100};
    this._joinButton.element.position = {x: context.windowWidth / 4, y: context.windowHeight / 2};
    if (this._invalidNameElement) {
      this._invalidNameElement.position = {x: context.windowWidth / 4, y: context.windowHeight / 2 + 30};
      this._sketch.rendererService.renderTextElement(context, this._invalidNameElement, 255, 0, 0);
    }

    this._sketch.rendererService.renderTextElement(context, this._titleElement, 255, 255, 255);
    const gray = this._joinButton.isHovered(context.mouseX, context.mouseY) ? 255 : 200;
    this._sketch.rendererService.renderTextElement(context, this._joinButton.element, gray, gray, gray)

    if (!this._userNameInput) {
      this._userNameInput = context.createInput();
    }
    this._userNameInput.position(context.windowWidth / 4, context.windowHeight / 2 - 30);
  }

  private get _canJoinRoom(): boolean {
    const userName = this._userNameInput.value().toString();
    return userName !== "" && !this._sketch.playerDataService.players.some(
      (metadata: PlayerMetadata) => metadata.userName === userName
    );
  }

  private get _invalidNameMessage(): string {
    return `\"${this._userNameInput.value().toString()}\" is an invalid name`;
  }
}
