import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';

import { AppContainerRoutingModule } from './appContainerRoutingModule';
import { AppContainerComponent } from './appContainerComponent';
import { RendererService } from "./platformer/services/rendererService";
import { PlayerDataService } from "./platformer/services/playerDataService";
import { SoundPlayerService } from "./platformer/services/soundPlayerService";

const config: SocketIoConfig = {
  url: "http://localhost:8080",
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
  providers: [PlayerDataService, RendererService, SoundPlayerService],
  bootstrap: [AppContainerComponent]
})
export class AppContainerModule { }
