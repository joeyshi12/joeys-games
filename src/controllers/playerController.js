"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlayerController = void 0;
const logger_1 = require("../util/logger");
const entity_1 = require("../transfers/entity");
class PlayerController {
    constructor(_socketServer, _playerService) {
        this._socketServer = _socketServer;
        this._playerService = _playerService;
    }
    joinLobby(socket) {
        logger_1.default.info(`Creating player [${socket.id}]`);
        const player = {
            userName: socket.id,
            state: entity_1.PlayerState.falling,
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
    updatePlayer(socket, player) {
        this._playerService.createOrUpdate(socket.id, player);
        this._socketServer.emit("receivePlayers", this._playerService.players);
    }
    exitLobby(socket) {
        logger_1.default.info(`Removing player [${socket.id}]`);
        this._playerService.removePlayer(socket.id);
    }
}
exports.PlayerController = PlayerController;
//# sourceMappingURL=playerController.js.map