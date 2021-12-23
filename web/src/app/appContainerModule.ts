import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';

import { AppContainerRoutingModule } from './appContainerRoutingModule';
import { AppContainerComponent } from './appContainerComponent';

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
  providers: [],
  bootstrap: [AppContainerComponent]
})
export class AppContainerModule { }
