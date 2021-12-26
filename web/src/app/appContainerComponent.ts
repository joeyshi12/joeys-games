import { Component, OnInit } from '@angular/core';
import { PlatformerSketch } from "./platformer/platformerSketch";
import { PlayerDataService } from "./platformer/services/playerDataService";
import { RendererService } from "./platformer/services/rendererService";
import { SoundPlayerService } from "./platformer/services/soundPlayerService";
import { StageService } from "./platformer/services/stageService";

@Component({
  selector: 'app-root',
  templateUrl: './appContainer.html',
  styleUrls: ['./appContainer.less']
})
export class AppContainerComponent implements OnInit {
  private _sketch: PlatformerSketch;

  constructor(playerDataService: PlayerDataService,
              rendererService: RendererService,
              soundPlayerService: SoundPlayerService,
              stageService: StageService) {
    this._sketch = new PlatformerSketch(playerDataService, rendererService, soundPlayerService, stageService);
  }

  ngOnInit(): void {
    this._sketch.initSketch();
  }
}
