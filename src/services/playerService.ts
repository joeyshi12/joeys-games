import { PlayerMetadata } from "../transfers/entity";

export class PlayerService {
    private _playerRepository: Map<string, PlayerMetadata>;

    constructor() {
        this._playerRepository = new Map();
    }

    public get players(): PlayerMetadata[] {
        return Array.from(this._playerRepository.values());
    }

    public createOrUpdate(socketId: string, player: PlayerMetadata): PlayerMetadata {
        this._playerRepository.set(socketId, player);
        return player;
    }

    public removePlayer(socketId: string): string {
        this._playerRepository.delete(socketId)
        return socketId;
    }
}