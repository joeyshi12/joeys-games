import PlatformPartyManager from "./platformPartyManager";
import { io } from "socket.io-client";

// SERVICE_URL is a webpack environment variable
// @ts-ignore
const socket: Socket = io(SERVICE_URL, { transports: ["websocket"] });

const game = new PlatformPartyManager("#canvas-container", socket);
game.start();
