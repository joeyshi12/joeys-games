import { Injectable } from "@angular/core";
import { Socket } from "ngx-socket-io";
import { PlayerMetadata } from "../../../../../src/transfers/playerMetadata";

/**
 * Data service class to update player through web socket
 */
@Injectable({
  providedIn: 'root'
})
export class ArcadeDataService {
  private _players: PlayerMetadata[];

  constructor(private _socket: Socket) {
    this._socket.on("getPlayers", this._getPlayers.bind(this));
  }

  public get players(): PlayerMetadata[] {
    return this._players;
  }

  public updatePlayer(player: PlayerMetadata): void {
    this._socket.emit("updatePlayer", player);
  }

  private _getPlayers(players: PlayerMetadata[]): void {
    this._players = players;
  }
}
