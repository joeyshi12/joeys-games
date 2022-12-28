import {io} from "socket.io-client";
import Game from "./game";

// window.onload = () => {
//     // const serverUrl = "http://localhost:8080";
//     const serverUrl = "http://pi.joeyshi.com:3141";
//     const socket = io(serverUrl);
//     const stageService = new StageService();
//     const playerDataServer = new PlayerDataService(socket);
//     const soundPlayerService = new SoundPlayerService();
//     const rendererService = new RendererService(stageService);
//     const sketch = new PlatformerSketch(
//         socket,
//         playerDataServer,
//         rendererService,
//         soundPlayerService,
//         stageService
//     );
//     sketch.initSketch();
// }

// const serverUrl = "http://localhost:8080";
const serverUrl = "http://pi.joeyshi.com:3141";
const socket = io(serverUrl);
const game = new Game(socket);
game.start();
