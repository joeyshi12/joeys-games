import Game from "./game";
import Snake from "./snake";
import Food from "./food";

function loadImage(source: string): Promise<HTMLImageElement> {
    const image = new Image();
    return new Promise((resolve, reject) => {
        image.onload = () => {
            resolve(image);
        };
        image.onerror = () => {
            reject(`Could not load image [${source}]`);
        };
        image.src = source;
    });
}

const gridSize = 18;
const unitLength = 30;
const canvas = document.createElement("canvas");
document.getElementById("canvas-container")?.appendChild(canvas);

canvas.width = gridSize * unitLength;
canvas.height = gridSize * unitLength;
const context = canvas.getContext("2d", {alpha: false});

if (!context) {
    throw new Error("2d context is not supported by browser");
}

loadImage("/images/apple.png").then(image => {
    const snake = new Snake(context, gridSize, unitLength);
    const food = new Food(context, 10, 10, image, gridSize, unitLength);
    const game = new Game(context, snake, food, gridSize, unitLength);
    game.start();
});
