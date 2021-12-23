import { PlayerService } from "../services/playerService";
import Log from "../util/logger";
import { PlayerMetadata, PlayerState } from "../transfers/playerMetadata";
import { Server, Socket } from "socket.io";

export class PlayerController {
    constructor(private _socketServer: Server,
                private _playerService: PlayerService) {}

    public joinLobby(socket: Socket): void {
        Log.info(`Creating player [${socket.id}]`);
        const player: PlayerMetadata = {
            userName: socket.id,
            state: PlayerState.walking,
            position: { x: 100, y: 100 },
            spriteIndex: 100,
            isFlipped: false
        };
        const updatedPlayer = this._playerService.createOrUpdate(socket.id, player);
        this._socketServer.sockets.emit("joined", updatedPlayer);
    }

    public updatePlayer(socket: Socket, player: PlayerMetadata): void {
        this._playerService.createOrUpdate(socket.id, player);
        this._socketServer.sockets.emit("receivePlayers", this._playerService.players);
    }

    public exitLobby(socket: Socket): void {
        Log.info(`Removing player [${socket.id}]`);
        this._playerService.removePlayer(socket.id)
    }
}