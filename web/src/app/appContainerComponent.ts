import { Component, OnInit } from '@angular/core';
import { PlatformerSketch } from "./platformer/platformerSketch";
import { ArcadeDataService } from "./platformer/services/arcadeDataService";
import { RendererService } from "./platformer/services/rendererService";
import { SoundPlayerService } from "./platformer/services/soundPlayerService";

@Component({
  selector: 'app-root',
  templateUrl: './appContainer.html',
  styleUrls: ['./appContainer.less']
})
export class AppContainerComponent implements OnInit {
  private _sketch: PlatformerSketch;

  constructor(arcadeService: ArcadeDataService,
              rendererService: RendererService,
              soundPlayerService: SoundPlayerService) {
    this._sketch = new PlatformerSketch(arcadeService, rendererService, soundPlayerService);
  }

  ngOnInit(): void {
    this._sketch.initSketch();
  }
}
