import { PlayerService } from "../services/playerService";
import Log from "../util/logger";
import { Socket } from "socket.io";
import { PlayerMetadata, PlayerState } from "../transfers/entity";

export class PlayerController {
  constructor(private _playerService: PlayerService) {
  }

  public joinRoom(socket: Socket): () => void {
    return () => {
      Log.info(`Creating player [${socket.id}]`);
      const player: PlayerMetadata = {
        userName: socket.id,
        state: PlayerState.falling,
        position: {x: 100, y: 100},
        spriteIndex: 354,
        isFlipped: false,
        collisionBox: {
          width: 36,
          height: 30,
          offset: {x: 0, y: 6}
        }
      };
      const updatedPlayer = this._playerService.createOrUpdate(socket.id, player);
      socket.emit("joinedRoom", updatedPlayer);
    };
  }

  public updatePlayer(socket: Socket): (player: PlayerMetadata) => void {
    return (player: PlayerMetadata) => {
      this._playerService.createOrUpdate(socket.id, player);
      socket.broadcast.emit("broadcastPlayers", this._playerService.players);
    };
  }

  public disconnectPlayer(socket: Socket): () => void {
    return () => {
      Log.info(`Removing player [${socket.id}]`);
      this._playerService.removePlayer(socket.id);
    };
  }
}
