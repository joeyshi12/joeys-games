import * as path from "path";
import {createServer} from "http";
import * as express from "express";
import {Server, Socket} from "socket.io";
import Log from "./util/logger";
import { PlayerController } from "./controllers/playerController";
import MapController from "./controllers/mapController";
import { Request, Response } from "express";

const app = express();
const httpServer = createServer(app);
const port = process.env["PORT"] || 8080;
const io = new Server(httpServer);

const playerController = new PlayerController();
const mapController = new MapController();

app.use(express.static(path.join(__dirname, "web")));
app.get("/map", (req: Request, res: Response) => mapController.getAllMaps(req, res));
app.post("/map", (req: Request, res: Response) => mapController.uploadMap(req, res));
app.use((req: Request, res: Response) => {
    res.status(404);
    res.sendFile(path.join(__dirname, "web", "404.html"));
});

io.on("connection", (socket: Socket) => {
    socket.on("login", playerController.createPlayer(socket).bind(this));
    socket.on("update", playerController.updatePlayer(socket));
    socket.on("disconnect", playerController.deletePlayer(socket));
});

httpServer.listen(port, () => {
    Log.info(`Listening on port ${port}`);
});
