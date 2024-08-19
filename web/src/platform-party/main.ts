import PlatformPartyManager from "./platformPartyManager";
import { io } from "socket.io-client";

// @ts-ignore
const socket: Socket = io(SERVICE_URL); // webpack environment variable

const game = new PlatformPartyManager("#canvas-container", socket);
game.start();
