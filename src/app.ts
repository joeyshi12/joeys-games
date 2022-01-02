import { Socket } from "socket.io";
import { createServer } from "http";
import Log from "./util/logger";
import { PlayerService } from "./services/playerService";
import * as path from 'path';
import express = require("express");
import * as controller from "./controllers/playerController";

const app = express();
const port = process.env.PORT || 8080;
const httpServer = createServer(app);
const io = require("socket.io")(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    credentials: true
  }
});

const service = new PlayerService();
app.use(express.static(path.join(__dirname, "..", "web")));

io.on("connection", (socket: Socket) => {
  socket.on("joinRoom", controller.joinRoom(socket, service));
  socket.on("getPlayers", controller.getPlayers(socket, service));
  socket.on("updatePlayer", controller.updatePlayer(socket, service));
  socket.on("disconnect", controller.disconnectPlayer(socket, service));
});

httpServer.listen(port, () => {
  Log.info(`Server running on port ${port}`);
});
