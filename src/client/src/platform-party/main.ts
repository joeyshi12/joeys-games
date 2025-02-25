import PlatformPartyManager from "./platformPartyManager";
import { io, Socket } from "socket.io-client";

const socket: Socket = io(location.origin, { transports: ["websocket"] });
const game = new PlatformPartyManager("#canvas-container", socket);
game.start();
