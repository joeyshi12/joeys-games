import { PlayerService } from "../services/playerService";
import Log from "../util/logger";
import { Socket } from "socket.io";
import { PlayerMetadata } from "../types/entityMetadata";

export class PlayerController {
  constructor(private _playerService: PlayerService) {
  }

  public createPlayer(req: Express.Request, res: Express.Response): void {
    try {
      console.log(req);
      // const createdPlayer = this._playerService.create(socket.id, player);
      // Log.info(`Created player ${player.userName}`);
      // socket.emit(ServerEvent.playerCreationSuccess, createdPlayer);
      // socket.broadcast.emit(ServerEvent.broadcastPlayers, this._playerService.players);
    } catch (e) {
      // const msg = e instanceof PlatformPartyError ? e.message : "Failed to create player";
      // socket.emit(ServerEvent.playerCreationFailed, msg)
    }
  }

  public updatePlayer(socket: Socket, player: PlayerMetadata): void {
    this._playerService.update(socket.id, player);
    socket.broadcast.emit("/player/client/update", this._playerService.players);
  }

  public disconnect(socket: Socket): void {
    const metadata = this._playerService.getPlayer(socket.id);
    if (this._playerService.removePlayer(socket.id)) {
      Log.info(`Removed player [${metadata.userName}]`);
    }
  }
}
