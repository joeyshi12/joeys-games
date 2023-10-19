import Game from "./game";
import Snake from "./snake";

const canvas = document.createElement("canvas");
const context = canvas.getContext("2d", {alpha: false});
if (!context) {
    throw new Error("2d context is not supported by browser");
}
document.getElementById("canvas-container")?.appendChild(canvas);

const unitLength = 16;
const snake = new Snake(context, unitLength);
const game = new Game(context, snake);
game.start();
