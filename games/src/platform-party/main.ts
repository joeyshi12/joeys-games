import Game from "./game";
import {Renderer} from "./renderer";
import {io} from "socket.io-client";

// @ts-ignore
const socket = io(`${SERVER_URL}/platform-party`); // webpack environment variable
const renderer = new Renderer();
const game = new Game(renderer, socket);
game.start();
