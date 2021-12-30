import { Server } from "socket.io";
import { createServer } from "http";
import {PlayerController} from "./playerController";
import Log from "./util/logger";
import {PlayerService} from "./playerService";
import express = require("express");
import * as path from 'path';
import { ClientEvent } from "./types/socketEvent";

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
io.on(ClientEvent.connection, controller.listenConnection);

httpServer.listen(port, () => {
  Log.info(`Server running on port ${port}`);
});
