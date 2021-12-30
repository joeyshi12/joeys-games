import { Injectable } from "@angular/core";
import { Socket } from "ngx-socket-io";
import { ControlledPlayer } from "../entities/controlledPlayer";
import { Character, PlayerMetadata } from "../../../../../src/types/entityMetadata";
import { RendererService } from "./rendererService";
import { ClientEvent, ServerEvent } from "../../../../../src/types/socketEvent";
import { Subject } from "rxjs";

/**
 * Data service class to update player through web socket
 */
@Injectable()
export class PlayerDataService {
  private _controlledPlayer: ControlledPlayer;
  private _players: PlayerMetadata[] = [];
  private _isPlayerInitialized$: Subject<boolean> = new Subject<boolean>();

  constructor(private _socket: Socket,
              private _rendererService: RendererService) {
    this._socket.on(ServerEvent.broadcastPlayers, (players: PlayerMetadata[]) => this._players = players);
  }

  public get controlledPlayer(): ControlledPlayer | undefined {
    return this._controlledPlayer;
  }

  public get players(): PlayerMetadata[] {
    return this._players;
  }

  public initControlledPlayer(userName: string,
                              character: Character,
                              next: (isInitialized: boolean) => void,
                              error: (msg: string) => void): void {
    const playerMetadata: PlayerMetadata = {
      userName: userName,
      position: {x: 100, y: 100},
      spriteIndex: 0,
      isFlipped: false,
      character: character,
      collisionBox: {
        width: 36,
        height: 30,
        offset: {x: 0, y: 6}
      },
    };
  }

  public updatePlayer(player: PlayerMetadata): void {
    this._socket.emit(ClientEvent.updatePlayer, player);
  }
}
