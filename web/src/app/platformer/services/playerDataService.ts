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
    this._socket.on("/player/client/getAll", (players: PlayerMetadata[]) => this._players = players);
  }

  public get controlledPlayer(): ControlledPlayer | undefined {
    return this._controlledPlayer;
  }

  public get players(): PlayerMetadata[] {
    return this._players;
  }

  public createPlayer(player: PlayerMetadata): Observable<PlayerMetadata> {
    const url = this._apiHost.concat("/player/server/create");
    return this._http.put(url, player).pipe(map((metadata: any) => metadata as PlayerMetadata));
  }

  public updatePlayer(player: PlayerMetadata): void {
    this._socket.emit("/player/server/update", player);
  }
}
