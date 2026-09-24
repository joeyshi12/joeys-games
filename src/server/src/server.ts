import * as path from "path";
import { createServer } from "http";
import * as express from "express";
import { Server, Socket } from "socket.io";
import { DatabaseSync } from "node:sqlite";
import Log from "./logger";
import { SnakeController } from "./controllers/snakeController";
import { PlatformPartyController } from "./controllers/platformPartyController";
import { Request, Response } from "express";

const app = express();
const httpServer = createServer(app);
const port = process.env["PORT"] || 8080;
const io = new Server(httpServer);
const dbPath = process.env["DB_PATH"] || "db.sqlite3";
const db = new DatabaseSync(dbPath);
db.exec(`
    CREATE TABLE IF NOT EXISTS snake_score (
        player_name TEXT,
        score INTEGER,
        creation_date TEXT
    )
`);
Log.info(`Initialized SQLite database at ${dbPath}`);

const snakeController = new SnakeController(db);
const platformPartyController = new PlatformPartyController();

// The page and the wasm have to move together: a browser holding a stale bundle would be talking
// to a peer running newer code, and since the host is another player there is nothing in the middle
// to reconcile the mismatch. express would otherwise serve it `public, max-age=0`. Measured: it
// already sends `application/wasm` for .wasm on its own, so only the caching needs saying.
// Registered before the general static mount so it wins.
app.use("/waldo-royale", express.static(path.join(__dirname, "web", "waldo-royale"), {
    setHeaders: (res) => res.setHeader("Cache-Control", "no-cache")
}));

app.use(express.static(path.join(__dirname, "web")));
app.use(express.json());

app.get("/snake/scores", (req: Request, res: Response) => snakeController.getAllScores(req, res));
app.put("/snake/scores", (req: Request, res: Response) => snakeController.submitScore(req, res));

app.get("/platform-party/maps", (req: Request, res: Response) => platformPartyController.getAllMaps(req, res));
app.put("/platform-party/maps", (req: Request, res: Response) => platformPartyController.uploadMap(req, res));

app.use((_: Request, res: Response) => {
    res.status(404);
    res.sendFile(path.join(__dirname, "web", "404.html"));
});

io.on("connection", (socket: Socket) => {
    socket.on("login", platformPartyController.createPlayer(socket).bind(this));
    socket.on("updatePlayer", platformPartyController.updatePlayer(socket).bind(this));
    socket.on("disconnect", platformPartyController.deletePlayer(socket).bind(this));
});

httpServer.listen(port, () => {
    Log.info(`Listening on port ${port}`);
});
