import { PlayerMetadata } from "./models";

export class SocketHandler {
    private readonly _socket: WebSocket;
    private _isOpen: boolean = false;

    private readonly _openFunc: () => void = this._onOpen.bind(this);
    private readonly _messageFunc: (event: MessageEvent) => void = this._onMessage.bind(this);
    private readonly _closeFunc: () => void = this._onClose.bind(this);
    private readonly _errorFunc: (event: Event) => void = this._onError.bind(this);

    constructor(socketId: string) {
        this._socket = new WebSocket(`ws://${location.host}/platformer/ws/${socketId}`);
        this._socket.addEventListener("open", this._openFunc);
        this._socket.addEventListener("message", this._messageFunc);
        this._socket.addEventListener("close", this._closeFunc);
        this._socket.addEventListener("error", this._errorFunc);
    }

    public get isOpen(): boolean {
        return this._isOpen;
    }

    public emitPlayerUpdate(player: PlayerMetadata): void {
        if (this.isOpen) {
            this._socket.send(JSON.stringify(player));
        }
    }

    public removeListeners(): void {
        this._socket.removeEventListener("open", this._openFunc);
        this._socket.removeEventListener("message", this._messageFunc);
        this._socket.removeEventListener("close", this._closeFunc);
        this._socket.removeEventListener("error", this._errorFunc);
    }

    private _onOpen(): void {
        this._isOpen = true;
    }

    private _onMessage(event: MessageEvent): void {
        console.log(event);
    }

    private _onClose(): void {
        this._isOpen = false;
    }

    private _onError(event: Event): void {
        console.log(event);
    }
}
