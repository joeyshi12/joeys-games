import { Drawable } from "./drawable";

export enum PlayerState {
  jumping = "jumping",
  landing = "landing",
  walking = "walking"
}

export interface PlayerMetadata extends Drawable {
  userName: string;
  state: PlayerState;
}

