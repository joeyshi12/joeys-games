import Game from "./game";
import {Renderer} from "./renderer";
import {io} from "socket.io-client";
import {DefaultEventsMap} from "socket.io/dist/typed-events";

// @ts-ignore
const socket: Socket<DefaultEventsMap, DefaultEventsMap> = io(SERVER_URL); // webpack environment variable

const canvas: HTMLCanvasElement = document.createElement("canvas");
const context: CanvasRenderingContext2D | null = canvas.getContext("2d", {alpha: false});
if (!context) {
    throw new Error("2d context is not supported by browser");
}

const renderer: Renderer = new Renderer();
renderer.context = context;
document.getElementById("canvas-container")?.appendChild(canvas);
renderer.resizeCanvas();

const game: Game = new Game(renderer, socket);
game.preload()
    .then(() => {
        game.start(canvas);
    })
    .catch((e) => {
        console.error(e);
    });
