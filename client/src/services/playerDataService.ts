import { Socket } from "socket.io-client";
import { ControlledPlayer } from "../entities/controlledPlayer";
import { PlayerMetadata } from "../../../server/types/entityMetadata";

/**
 * Data service class to update player through web socket
 */
export class PlayerDataService {
  private _controlledPlayer: ControlledPlayer;
  private _players: PlayerMetadata[] = [];

  constructor(private _socket: Socket) {
    this._socket.on("receivePlayers", (players: PlayerMetadata[]) => {
      this._players = players;
    })
  }

  public get controlledPlayer(): ControlledPlayer {
    return this._controlledPlayer;
  }

  public set controlledPlayer(val: ControlledPlayer) {
    this._controlledPlayer = val;
  }

  public get players(): PlayerMetadata[] {
    return this._players;
  }

  public updatePlayer(player: PlayerMetadata): void {
    this._socket.emit("updatePlayer", player);
  }
}
