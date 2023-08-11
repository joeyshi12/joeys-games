import Log from "../util/logger";
import { Socket } from "socket.io";
import { Character, PlayerMetadata } from "../types/playerMetadata";

export class PlayerController {
    private _playerRepository: Map<string, PlayerMetadata>;

    constructor() {
        this._playerRepository = new Map();
    }

    public createPlayer(socket: Socket): (_: string) => void {
        return (userName: string) => {
            if (this._isInvalidUserName(userName)) {
                socket.emit("joinError", `"${userName}" is an unavailable or invalid name`);
                return;
            }
            Log.info(`Creating player [${userName}]`);
            const randomCharacter = <Character>+Object.keys(Character)[Math.floor(Math.random() * 3)];
            const player: PlayerMetadata = {
                name: userName,
                character: randomCharacter,
                position: {x: 80, y: 500},
                spriteIndex: 354,
                isFlipped: false,
                collisionBox: {
                    width: 16,
                    height: 16,
                    offset: {x: 0, y: 0}
                }
            };
            this._playerRepository.set(socket.id, player);
            socket.emit("joinSuccess", player);
        };
    }

    public updatePlayer(socket: Socket): (_: PlayerMetadata) => void {
        return (metadata: PlayerMetadata) => {
            this._playerRepository.set(socket.id, metadata);
            socket.broadcast.emit("receivePlayer", metadata);
        };
    }

    public deletePlayer(socket: Socket): () => void {
        return () => {
            const player = this._playerRepository.get(socket.id);
            if (player) {
                Log.info(`Removing player [${player.name}]`);
                this._playerRepository.delete(socket.id);
                socket.broadcast.emit("receivePlayers", this._players);
            }
        };
    }

    private get _players(): PlayerMetadata[] {
        return Array.from(this._playerRepository.values());
    }

    private _isInvalidUserName(userName: string): boolean {
        return userName === ""
      || userName.length > 20
      || this._players.some((metadata: PlayerMetadata) => metadata.name === userName);
    }
}
