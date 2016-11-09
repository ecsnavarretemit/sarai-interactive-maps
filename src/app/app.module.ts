/*!
 * App Module
 *
 * Copyright(c) Exequiel Ceasar Navarrete <esnavarrete1@up.edu.ph>
 * Licensed under MIT
 */

import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ModalModule } from 'ng2-bootstrap/ng2-bootstrap';
import { SaraiNg2RoutingModule } from './app-routing.module';
import { StoreModule } from './store';
import { MapModule } from './map';

import { CookieService } from 'angular2-cookie/services/cookies.service';
import { AppLoggerService } from './app-logger.service';

import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    SaraiNg2RoutingModule,
    ModalModule,
    StoreModule,
    MapModule
  ],
  providers: [
    AppLoggerService,
    CookieService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }


