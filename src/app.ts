import { Server, Socket } from "socket.io";
import { createServer } from "http";
import {PlayerController} from "./controllers/playerController";
import Log from "./util/logger";
import {PlayerService} from "./services/playerService";
import express = require("express");
import * as path from 'path';
import { PlayerMetadata } from "./types/entityMetadata";

const app = express();
const port = process.env.PORT || 8080;

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    credentials: true
  }
});

const controller = new PlayerController(new PlayerService());

app.use(express.static(path.join(__dirname, "..", "web")));
app.put("/player/create", controller.createPlayer);
io.on("connection", (socket: Socket) => {
  Log.info(`Socket connected [${socket.id}]`);
  socket.on("/player/server/update", (player: PlayerMetadata) => controller.updatePlayer(socket, player));
  socket.on("disconnect", () => controller.disconnect(socket));
});

httpServer.listen(port, () => {
  Log.info(`Server running on port ${port}`);
});
