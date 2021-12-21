import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppContainerRoutingModule } from './appContainerRoutingModule';
import { AppContainerComponent } from './appContainerComponent';

@NgModule({
  declarations: [
    AppContainerComponent
  ],
  imports: [
    BrowserModule,
    AppContainerRoutingModule
  ],
  providers: [],
  bootstrap: [AppContainerComponent]
})
export class AppContainerModule { }
