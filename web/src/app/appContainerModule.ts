import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';

import { AppContainerRoutingModule } from './appContainerRoutingModule';
import { AppContainerComponent } from './appContainerComponent';
import { RendererService } from "./platformer/services/rendererService";
import { PlayerDataService } from "./platformer/services/playerDataService";
import { SoundPlayerService } from "./platformer/services/soundPlayerService";
import { StageService } from "./platformer/services/stageService";
import { environment } from 'src/environments/environment';

const config: SocketIoConfig = {
  url: environment.apiHost,
  options: {}
};

@NgModule({
  declarations: [
    AppContainerComponent
  ],
  imports: [
    BrowserModule,
    AppContainerRoutingModule,
    SocketIoModule.forRoot(config),
  ],
  providers: [
    PlayerDataService,
    RendererService,
    SoundPlayerService,
    StageService
  ],
  bootstrap: [AppContainerComponent]
})
export class AppContainerModule { }
