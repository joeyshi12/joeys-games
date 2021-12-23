import { Injectable } from "@angular/core";
import { Socket } from "ngx-socket-io";
import { Player } from "../entities/player";

/**
 * Data service class to update player through web socket
 */
@Injectable({
  providedIn: 'root'
})
export class ArcadeDataService {
  private _players: Player[];

  constructor(private _socket: Socket) {
    this._socket.on("getPlayers", this._getPlayers.bind(this));
  }

  public get players(): Player[] {
    return this._players;
  }

  public updatePlayer(player: Player): void {
    this._socket.emit("updatePlayer", player);
  }

  private _getPlayers(players: Player[]): void {
    this._players = players;
  }
}
