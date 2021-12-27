"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const socket_io_1 = require("socket.io");
const http_1 = require("http");
const playerController_1 = require("./controllers/playerController");
const logger_1 = require("./util/logger");
const playerService_1 = require("./services/playerService");
const express = require("express");
const app = express();
const port = 8080;
const httpServer = (0, http_1.createServer)(app);
const io = new socket_io_1.Server(httpServer, {
    cors: { origin: "*" }
});
const service = new playerService_1.PlayerService();
const controller = new playerController_1.PlayerController(io, service);
io.on("connection", (socket) => {
    socket.on("join", () => controller.joinLobby(socket));
    socket.on("updatePlayer", (player) => controller.updatePlayer(socket, player));
    socket.on("disconnect", () => controller.exitLobby(socket));
});
httpServer.listen(port, () => {
    logger_1.default.info(`Server running on port ${port}`);
});
//# sourceMappingURL=app.js.map