import express from "express";
import { Server, Socket } from "socket.io";
import { createServer } from "http";
import {ArcadeController} from "./controllers/arcadeController";
import Log from "./util/logger";
import {ArcadeService} from "./services/arcadeService";

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
  socket.on("join", (data: any) => {
    console.log(data);
    controller.joinLobby("");
  });
  socket.on("updatePlayer", (data: any) => {
    console.log(data);
    controller.updatePlayer(undefined);
  });
  socket.on("disconnect", () => {
    controller.exitLobby("");
  });
});

httpServer.listen(port, () => {
  Log.info(`Server listening to port ${port}`);
});
