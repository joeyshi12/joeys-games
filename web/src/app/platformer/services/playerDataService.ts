import { Injectable } from "@angular/core";
import { Socket } from "ngx-socket-io";
import { ControlledPlayer } from "../entities/controlledPlayer";
import { PlayerMetadata } from "../../../../../src/types/entityMetadata";
import { RendererService } from "./rendererService";

/**
 * Data service class to update player through web socket
 */
@Injectable()
export class PlayerDataService {
  private _controlledPlayer: ControlledPlayer;
  private _players: PlayerMetadata[] = [];

  constructor(private _socket: Socket,
              private _rendererService: RendererService) {
    this._socket.on("joined", (player: PlayerMetadata) => {
      if (!this._controlledPlayer) {
        this._controlledPlayer = new ControlledPlayer(player);
        this._rendererService.focusedEntity = this._controlledPlayer.metadata;
      }
    });
    this._socket.on("receivePlayers", (players: PlayerMetadata[]) => {
      this._players = players;
    })
  }

  public get controlledPlayer(): ControlledPlayer {
    return this._controlledPlayer;
  }

  public get players(): PlayerMetadata[] {
    return this._players;
  }

  public joinLobby(): void {
    this._socket.emit("join");
  }

  public updatePlayer(player: PlayerMetadata): void {
    this._socket.emit("updatePlayer", player);
  }
}
