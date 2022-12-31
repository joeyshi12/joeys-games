import Game from "./game";
import {Renderer} from "./renderer";
import SoundPlayer from "./soundPlayer";

const soundPlayer = new SoundPlayer();
const renderer = new Renderer();
const game = new Game(renderer, soundPlayer);
game.start();
