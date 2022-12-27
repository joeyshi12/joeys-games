import {PlatformerSketch} from "./platformerSketch";
import {PlayerDataService} from "./services/playerDataService";
import {RendererService} from "./services/rendererService";
import {SoundPlayerService} from "./services/soundPlayerService";
import {io} from "socket.io-client";
import {StageService} from "./services/stageService";

window.onload = () => {
    // const serverUrl = "http://localhost:8080";
    const serverUrl = "http://pi.joeyshi.com:3141";
    const socket = io(serverUrl);
    const stageService = new StageService();
    const playerDataServer = new PlayerDataService(socket);
    const soundPlayerService = new SoundPlayerService();
    const rendererService = new RendererService(stageService);
    const sketch = new PlatformerSketch(
        socket,
        playerDataServer,
        rendererService,
        soundPlayerService,
        stageService
    );
    sketch.initSketch();
}
