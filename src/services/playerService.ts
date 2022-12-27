import { PlayerMetadata } from "../types/entityMetadata";

export class PlayerService {
  private _playerRepository: Map<string, PlayerMetadata>;

  constructor() {
    this._playerRepository = new Map();
  }

  public get players(): PlayerMetadata[] {
    return Array.from(this._playerRepository.values());
  }

  public getPlayer(id: string): PlayerMetadata {
    return this._playerRepository.get(id);
  }

  public update(id: string, player: PlayerMetadata): PlayerMetadata {
    this._playerRepository.set(id, player);
    return player;
  }

  public removePlayer(id: string): boolean {
    return this._playerRepository.delete(id);
  }
}
