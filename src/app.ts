import { Server, Socket } from "socket.io";
import { createServer } from "http";
import {ArcadeController} from "./controllers/arcadeController";
import Log from "./util/logger";
import {ArcadeService} from "./services/arcadeService";
import express = require("express");
import { Player } from "../web/src/app/platformer/entities/player";

const app = express();
const port = 8080;

const httpServer = createServer(app);
const service = new ArcadeService();
const controller = new ArcadeController(service);

const io = new Server(httpServer, {
  transports: ["websocket", "polling"],
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    credentials: true,
  },
  allowEIO3: true,
});

io.on("connection", (socket: Socket) => {
  socket.on("updatePlayer", (player: Player) => {
    controller.updatePlayer(socket.id, player);
    Log.info(player);
    io.sockets.emit("getPlayers", controller.getPlayers());
  });
  socket.on("disconnect", () => {
    controller.exitLobby(socket.id);
  });
});

httpServer.listen(port, () => {
  Log.info(`Server listening to port ${port}`);
});
