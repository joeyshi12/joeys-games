import { PlayerService } from "../services/playerService";
import Log from "../util/logger";
import { Server, Socket } from "socket.io";
import { PlayerMetadata, PlayerState } from "../transfers/entity";

export class PlayerController {
    constructor(private _socketServer: Server,
                private _playerService: PlayerService) {}

    public joinLobby(socket: Socket): void {
        Log.info(`Creating player [${socket.id}]`);
        const player: PlayerMetadata = {
            userName: socket.id,
            state: PlayerState.falling,
            position: { x: 100, y: 100 },
            spriteIndex: 354,
            isFlipped: false,
            collisionBox: {
                width: 36,
                height: 30,
                offset: { x: 0, y: 6 }
            }
        };
        const updatedPlayer = this._playerService.createOrUpdate(socket.id, player);
        socket.emit("joined", updatedPlayer);
    }

    public updatePlayer(socket: Socket, player: PlayerMetadata): void {
        this._playerService.createOrUpdate(socket.id, player);
        this._socketServer.emit("receivePlayers", this._playerService.players);
    }

    public exitLobby(socket: Socket): void {
        Log.info(`Removing player [${socket.id}]`);
        this._playerService.removePlayer(socket.id)
    }
}