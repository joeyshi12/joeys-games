import Game from "./game";
import {Renderer} from "./renderer";
import SoundPlayer from "./soundPlayer";
import {io} from "socket.io-client";

const serverUrl = "http://localhost:8080";
// const serverUrl = "http://pi.joeyshi.com:3141";
const socket = io(serverUrl);
const soundPlayer = new SoundPlayer();
const renderer = new Renderer();
const game = new Game(renderer, soundPlayer, socket);
game.start();
