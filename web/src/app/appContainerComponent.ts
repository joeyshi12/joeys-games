import { Component, OnInit } from '@angular/core';
import { PlatformerSketch } from "./platformer/platformerSketch";
import { PlayerDataService } from "./platformer/services/playerDataService";
import { RendererService } from "./platformer/services/rendererService";
import { SoundPlayerService } from "./platformer/services/soundPlayerService";

@Component({
  selector: 'app-root',
  templateUrl: './appContainer.html',
  styleUrls: ['./appContainer.less']
})
export class AppContainerComponent implements OnInit {
  private _sketch: PlatformerSketch;

  constructor(playerDataService: PlayerDataService,
              rendererService: RendererService,
              soundPlayerService: SoundPlayerService) {
    this._sketch = new PlatformerSketch(playerDataService, rendererService, soundPlayerService);
  }

  ngOnInit(): void {
    this._sketch.initSketch();
  }
}
