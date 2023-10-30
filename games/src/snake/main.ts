import Game from "./game";
import Snake from "./snake";
import Food from "./food";
import { Sound, loadAudioBuffer } from "./sound";
import { SnakeScore } from "../../../src/models/snakeModels";

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

const gridSize = 16;
const unitLength = 30;
const canvas = document.createElement("canvas");
document.getElementById("canvas-container")?.appendChild(canvas);

canvas.width = gridSize * unitLength;
canvas.height = gridSize * unitLength;
const context = canvas.getContext("2d", {alpha: false});

if (!context) {
    throw new Error("2d context is not supported by browser");
}

const scoreElement = document.getElementById("score-field")?.getElementsByTagName("span")[0];
if (!scoreElement) {
    throw Error("score-field element not found");
}

const nameInputElement = document.getElementById("name-field")?.getElementsByTagName("input")[0];
if (!nameInputElement) {
    throw Error("name-field element not found");
}

const submitButtonElement = document.getElementById("submit-button")?.getElementsByTagName("button")[0];
if (!submitButtonElement) {
    throw Error("submit-button element not found");
}

Promise.all([
    loadImage("/images/apple.png"),
    loadAudioBuffer("/sounds/pop.wav")
]).then(([image, popAudioBuffer]) => {
    const growSound = new Sound(popAudioBuffer);
    const snake = new Snake(context, nameInputElement, submitButtonElement, growSound, gridSize, unitLength);
    const food = new Food(context, 10, 10, image, gridSize, unitLength);
    const game = new Game(context, scoreElement, snake, food, gridSize, unitLength);

    submitButtonElement.addEventListener("click", () => {
        const name = nameInputElement.value;
        if (name.length < 3) {
            alert("Name is too short");
            return;
        }
        if (name.length > 8) {
            alert("Name is too long");
            return;
        }
        const snakeScore: SnakeScore = {
            score: game.score,
            playerName: name,
        };
        fetch("/snake/scores", {
            method: "put",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify(snakeScore)
        }).then(() => { 
            window.location.reload();
        }).catch((e) => {
            console.error(e);
        });
    });
    game.start();
});

// Render player scores in score-table element
fetch("/snake/scores").then((res) => {
    const scoreTableBody: HTMLTableSectionElement | undefined =
        document.getElementById("score-table")?.getElementsByTagName("tbody")[0];
    if (!scoreTableBody) {
        console.warn("Score table body not found");
        return;
    }
    res.json().then((scores: SnakeScore[]) => {
        for (const score of scores) {
            const row = scoreTableBody.insertRow();
            const scoreCell = row.insertCell();
            const scoreNode = document.createTextNode(String(score.score));
            scoreCell.appendChild(scoreNode);

            const nameCell = row.insertCell();
            const nameNode = document.createTextNode(score.playerName);
            nameCell.appendChild(nameNode);

            const dateCell = row.insertCell();
            const dateNode = document.createTextNode(score.creationDate ?? "");
            dateCell.appendChild(dateNode);
        }
    });
});
