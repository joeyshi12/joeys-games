import Game from "./game";
import Snake from "./snake";

const gridSize = 20;
const unitLength = 32;
const canvas = document.createElement("canvas");
canvas.width = gridSize * unitLength;
canvas.height = gridSize * unitLength;
canvas.setAttribute("style", "border: 1px solid;");
const context = canvas.getContext("2d", {alpha: false});
if (!context) {
    throw new Error("2d context is not supported by browser");
}
document.getElementById("canvas-container")?.appendChild(canvas);

const snake = new Snake(context, unitLength);
const game = new Game(context, snake);
game.start();
