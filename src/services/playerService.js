"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlayerService = void 0;
class PlayerService {
    constructor() {
        this._playerRepository = new Map();
    }
    get players() {
        return Array.from(this._playerRepository.values());
    }
    createOrUpdate(socketId, player) {
        this._playerRepository.set(socketId, player);
        return player;
    }
    removePlayer(socketId) {
        this._playerRepository.delete(socketId);
        return socketId;
    }
}
exports.PlayerService = PlayerService;
//# sourceMappingURL=playerService.js.map