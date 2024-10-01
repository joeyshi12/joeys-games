import SnakeManager from "./snakeManager";
import { SnakeScore } from "./models";

const manager = new SnakeManager("#canvas-container");
manager.start();

// Render player scores in score-table element
fetch("/snake/scores").then((res) => {
    const scoreTableBody = document.querySelector("#score-table")?.getElementsByTagName("tbody")[0];
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
}).catch((e) => {
    console.error(e);
});
