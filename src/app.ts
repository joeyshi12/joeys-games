import { Server, Socket } from "socket.io";
import { createServer } from "http";
import {PlayerController} from "./controllers/playerController";
import Log from "./util/logger";
import {PlayerService} from "./services/playerService";
import express = require("express");
import { PlayerMetadata } from "./transfers/playerMetadata";

const app = express();
const port = 8080;

const httpServer = createServer(app);
const io = new Server(httpServer, {
  transports: ["websocket", "polling"],
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    credentials: true,
  },
  allowEIO3: true,
});
const service = new PlayerService();
const controller = new PlayerController(io, service);

io.on("connection", (socket: Socket) => {
  socket.on("join",() => controller.joinLobby(socket));
  socket.on("updatePlayer", (player: PlayerMetadata) => controller.updatePlayer(socket, player));
  socket.on("disconnect", () => controller.exitLobby(socket));
});

httpServer.listen(port, () => {
  Log.info(`Server running on port ${port}`);
});
