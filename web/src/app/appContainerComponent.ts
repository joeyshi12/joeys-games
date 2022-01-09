import { Component, OnInit } from '@angular/core';
import { PlatformerSketch } from "./platformer/platformerSketch";
import { PlayerDataService } from "./platformer/services/playerDataService";
import { RendererService } from "./platformer/services/rendererService";
import { SoundPlayerService } from "./platformer/services/soundPlayerService";
import { StageService } from "./platformer/services/stageService";
import { Socket } from "ngx-socket-io";
import {Meta} from "@angular/platform-browser";

@Component({
  selector: 'app-root',
  templateUrl: './appContainer.html',
  styleUrls: ['./appContainer.less']
})
export class AppContainerComponent implements OnInit {
  private _sketch: PlatformerSketch;

  constructor(socket: Socket,
              playerDataService: PlayerDataService,
              rendererService: RendererService,
              soundPlayerService: SoundPlayerService,
              stageService: StageService,
              meta: Meta) {
    meta.addTags([
      {name: "author", content: "Joey Shi"},
      {name: "description", property: "og:description", content: "Real-time multiplayer browser platformer made with p5"},
      {name: "image", property: "og:image", content: "https://raw.githubusercontent.com/joeyshi12/platform-party/main/assets/snapshot.png"}
    ]);
    this._sketch = new PlatformerSketch(socket, playerDataService, rendererService, soundPlayerService, stageService);
  }

  ngOnInit(): void {
    this._sketch.initSketch();
  }
}
