import Snake from "./snake";
import Food from "./food";
import GameManager from "../core/gameManager";
import { loadImage } from "../core/image";
import { loadSound } from "../core/sound";
import { SnakeScore } from "./models";

const GRID_SIZE = 16;
const UNIT_LENGTH = 30;
const NUM_TILES = GRID_SIZE * GRID_SIZE;
const GRID_LENGTH = GRID_SIZE * UNIT_LENGTH;

// shift food position by this amount if spawned inside snake; value should be coprime with number of tiles
const FOOD_SPAWN_STRIDE = 13;

export default class SnakeManager extends GameManager {
    private _snake: Snake;
    private _food: Food;
    private _scoreElement: HTMLSpanElement;
    private _nameInputElement: HTMLInputElement;
    private _submitButtonElement: HTMLButtonElement;

    public constructor(parentSelector: string) {
        super(parentSelector, 80);
        this.ctx.canvas.width = GRID_LENGTH;
        this.ctx.canvas.height = GRID_LENGTH;
        const scoreElement = document.querySelector("#score-field")?.getElementsByTagName("span")[0];
        if (!scoreElement) {
            throw Error("score-field element not found");
        }
        const nameInputElement = document.querySelector("#name-field")?.getElementsByTagName("input")[0];
        if (!nameInputElement) {
            throw Error("name-field element not found");
        }
        const submitButtonElement = document.querySelector("#submit-button")?.getElementsByTagName("button")[0];
        if (!submitButtonElement) {
            throw Error("submit-button element not found");
        }
        this._scoreElement = scoreElement;
        this._nameInputElement = nameInputElement;
        this._submitButtonElement = submitButtonElement;
    }

    public get score(): number {
        return this._snake.size - 3;
    }

    protected override async setUp(): Promise<void> {
        const [growSound, foodImage] = await Promise.all([
            loadSound("/sounds/pop.wav"),
            loadImage("/images/apple.png")
        ]);
        this._snake = new Snake(this.ctx, this._nameInputElement, this._submitButtonElement, growSound, GRID_SIZE, UNIT_LENGTH);
        this._food = new Food(this.ctx, 10, 10, foodImage, UNIT_LENGTH);

        window.addEventListener("keydown", this._handleKeyDown.bind(this));
        this._submitButtonElement.addEventListener("click", this._handleSubmitClick.bind(this));

        this.ctx.fillStyle = "#fff";
        this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    }

    protected override draw(): void {
        this.ctx.fillStyle = "#fff";
        this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
        this._food.draw();
        this._snake.draw();
        this.ctx.fillStyle = "#000";
        for (let i = 1; i < GRID_SIZE; i++) {
            const offset = i * UNIT_LENGTH - 1;
            this.ctx.fillRect(offset, 0, 1, this.ctx.canvas.height);
            this.ctx.fillRect(0, offset, this.ctx.canvas.width, 1);
        }
    }

    protected override update(): void {
        this._snake.update();
        if (this._snake.isHeadAtPos(this._food.posX, this._food.posY)) {
            this._snake.grow();
            this._setNextFoodPosition();
            this._scoreElement.textContent = String(this.score);
        }
    }

    private _handleKeyDown(event: KeyboardEvent) {
        switch (event.key.toLowerCase()) {
            case "w":
            case "arrowup":
                this._snake.setDirection(0, -1);
                break;
            case "a":
            case "arrowleft":
                this._snake.setDirection(-1, 0);
                break;
            case "s":
            case "arrowdown":
                this._snake.setDirection(0, 1);
                break;
            case "d":
            case "arrowright":
                this._snake.setDirection(1, 0);
                break;
        }
    }

    private _handleSubmitClick() {
        this._nameInputElement.disabled = true;
        this._submitButtonElement.disabled = true;

        const name = this._nameInputElement.value;
        if (name.length < 3) {
            alert("Name is too short");
            return;
        }
        if (name.length > 8) {
            alert("Name is too long");
            return;
        }

        const snakeScore: SnakeScore = {
            score: this.score,
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
        }).finally(() => {
            this._nameInputElement.disabled = false;
            this._submitButtonElement.disabled = false;
        });
    }

    private _setNextFoodPosition() {
        let newPosition = Math.floor(Math.random() * NUM_TILES);
        for (let i = 0; i < NUM_TILES; i++) {
            const x = newPosition % GRID_SIZE;
            const y = Math.floor(newPosition / GRID_SIZE);
            if (!this._snake.contains(x, y)) {
                this._food.updatePosition(x, y);
                break;
            }
            newPosition = (newPosition + FOOD_SPAWN_STRIDE) % NUM_TILES;
        }
    }
}
