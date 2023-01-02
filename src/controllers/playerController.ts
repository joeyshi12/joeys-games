import { PlayerService } from "../services/playerService";
import Log from "../util/logger";
import { Socket } from "socket.io";
import { Character, PlayerMetadata } from "../types/entityMetadata";

export function joinRoom(socket: Socket, playerService: PlayerService): (_: string) => void {
  return (userName: string) => {
    if (isInvalidUserName(userName, playerService)) {
      socket.emit("joinRoomFailure", `"${userName}" is an unavailable or invalid name`);
      return;
    }
    Log.info(`Creating player [${userName}]`);
    const randomCharacter = <Character>+Object.keys(Character)[Math.floor(Math.random() * 3)];
    const player: PlayerMetadata = {
      name: userName,
      character: randomCharacter,
      position: {x: 80, y: 500},
      spriteIndex: 354,
      isFlipped: false,
      collisionBox: {
        width: 16,
        height: 16,
        offset: {x: 0, y: 0}
      }
    };
    const updatedPlayer = playerService.update(socket.id, player);
    socket.emit("joinRoomSuccess", updatedPlayer);
    socket.emit("receivePlayers", playerService.players);
  };
}

export function updatePlayer(socket: Socket, playerService: PlayerService): (_: PlayerMetadata) => void {
  return (metadata: PlayerMetadata) => {
    playerService.update(socket.id, metadata);
    socket.broadcast.volatile.emit("receivePlayers", playerService.players);
  };
}

export function disconnectPlayer(socket: Socket, playerService: PlayerService): () => void {
  return () => {
    const player = playerService.getPlayer(socket.id);
    if (player) {
      Log.info(`Removing player [${player.name}]`);
      playerService.removePlayer(socket.id);
      socket.broadcast.emit("receivePlayers", playerService.players);
    }
  };
}

function isInvalidUserName(userName: string, playerService: PlayerService): boolean {
  return userName === ""
    || userName.length > 20
    || playerService.players.some((metadata: PlayerMetadata) => metadata.name === userName);
}
