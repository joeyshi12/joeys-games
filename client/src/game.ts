import {Socket} from "socket.io-client";

export default class Game {
    private readonly context: CanvasRenderingContext2D;
    private readonly nextFrame = this.gameLoop.bind(this);
    public image?: HTMLImageElement;

    public constructor(private readonly _socket: Socket) {
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");
        if (context === null) {
            throw new Error("2d context not supported by browser");
        }
        this.context = context;
        this.updateCanvasSize();
        document.body.appendChild(canvas);
        window.addEventListener("resize", () => this.updateCanvasSize());
        window.addEventListener("pointerMove", () => this.mouseMoved());
        const image = new Image();
        const source = new URL("/src/assets/spritesheet.png");
        new Promise<HTMLImageElement>((resolve, reject) => {
            image.onload = () => {
                resolve(image);
            };
            image.onerror = () => {
                reject(new Error(`Unable to load image '${source}'`));
            };
            image.src = source instanceof URL ? source.href : `assets/${source}`;
        }).then((image: HTMLImageElement) => {
            this.image = image;
            console.log("got image");
        }).catch(_ => {
            console.log("GOT ERROR :(");
        });
    }

    public start(): void {
        requestAnimationFrame(this.nextFrame)
    }

    private gameLoop(): void {
        this.context.fillStyle = "black";
        this.context.fillRect(0, 0, this.context.canvas.width, this.context.canvas.height);
        if (this.image) {
            this.context.drawImage(this.image, 100, 100, 20, 20);
        }
        this.context.restore();
        requestAnimationFrame(this.nextFrame);
    }

    private updateCanvasSize(): void {
        this.context.canvas.width = window.innerWidth;
        this.context.canvas.height = window.innerHeight;
    }

    private mouseMoved(): void {
        console.log("mouse moved");
    }
}