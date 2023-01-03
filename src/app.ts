import * as path from "path";
import {createServer} from "http";
import * as express from "express";
import {Server, Socket} from "socket.io";
import Log from "./util/logger";
import { PlayerController } from "./controllers/playerController";

const app = express();
const httpServer = createServer(app);
const port = process.env["PORT"] || 8080;
const io = new Server(httpServer, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});
const controller = new PlayerController();
app.use(express.static(path.join(__dirname, "client")));
io.on("connection", (socket: Socket) => {
    socket.on("login", controller.createPlayer(socket));
    socket.on("update", controller.updatePlayer(socket));
    socket.on("disconnect", controller.deletePlayer(socket));
});

httpServer.listen(port, () => {
    Log.info(`Server running on port ${port}`);
});
