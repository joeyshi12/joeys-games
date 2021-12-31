import { Injectable, isDevMode } from "@angular/core";
import { Socket } from "ngx-socket-io";
import { ControlledPlayer } from "../entities/controlledPlayer";
import { PlayerMetadata } from "../../../../../src/types/entityMetadata";
import { RendererService } from "./rendererService";
import { map, Observable } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { environment as devEnvironment } from "../../../environments/environment";
import { environment as prodEnvironment } from "../../../environments/environment.prod";

/**
 * Data service class to update player through web socket
 */
@Injectable()
export class PlayerDataService {
  private _controlledPlayer: ControlledPlayer;
  private _players: PlayerMetadata[] = [];
  private _apiHost: string;

  constructor(private _socket: Socket,
              private _rendererService: RendererService,
              private _http: HttpClient) {
    this._apiHost = isDevMode() ? devEnvironment.apiHost : prodEnvironment.apiHost;
    this._socket.on("joinedRoom", (player: PlayerMetadata) => {
      if (!this._controlledPlayer) {
        this._controlledPlayer = new ControlledPlayer(player);
        this._rendererService.focusedEntity = this._controlledPlayer.metadata;
      }
    });
    this._socket.on("broadcastPlayers", (players: PlayerMetadata[]) => {
      this._players = players;
    })
  }

  public get controlledPlayer(): ControlledPlayer {
    return this._controlledPlayer;
  }

  public get players(): PlayerMetadata[] {
    return this._players;
  }

  public joinRoom(): void {
    this._socket.emit("joinRoom");
  }

  public createPlayer(player: PlayerMetadata): Observable<PlayerMetadata> {
    const url = this._apiHost.concat("/player/server/create");
    return this._http.put(url, player).pipe(map((metadata: any) => metadata as PlayerMetadata));
  }

  public updatePlayer(player: PlayerMetadata): void {
    this._socket.emit("updatePlayer", player);
  }
}
