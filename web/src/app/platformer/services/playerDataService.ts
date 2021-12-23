import { Injectable } from "@angular/core";
import { Socket } from "ngx-socket-io";
import { PlayerMetadata } from "../../../../../src/transfers/playerMetadata";
import { ControlledPlayer } from "../entities/controlledPlayer";

/**
 * Data service class to update player through web socket
 */
@Injectable({
  providedIn: 'root'
})
export class PlayerDataService {
  private _controlledPlayer: ControlledPlayer;
  private _players: PlayerMetadata[] = [];

  constructor(private _socket: Socket) {
    this._socket.on("joined", (player: PlayerMetadata) => {
      this._controlledPlayer = new ControlledPlayer(player);
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
