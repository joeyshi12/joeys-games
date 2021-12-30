import { PlayerMetadata } from "./types/entityMetadata";
import { PlatformPartyError } from "./types/exception";

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

  public create(id: string, player: PlayerMetadata): PlayerMetadata {
    this._validateUniqueUserName(player.userName);
    this.update(id, player);
    return player;
  }

  public update(id: string, player: PlayerMetadata): PlayerMetadata {
    this._playerRepository.set(id, player);
    return player;
  }

  public removePlayer(id: string): boolean {
    return this._playerRepository.delete(id);
  }

  private _validateUniqueUserName(userName: string): void {
    this._playerRepository.forEach((metadata: PlayerMetadata) => {
      if (metadata.userName === userName) {
        throw new PlatformPartyError(`Username [${userName}] is not available`);
      }
    });
  }
}
