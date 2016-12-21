/*!
 * App Module
 *
 * Copyright(c) Exequiel Ceasar Navarrete <esnavarrete1@up.edu.ph>
 * Licensed under MIT
 */

import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { Http } from '@angular/http';
import { ModalModule, TooltipModule, AccordionModule } from 'ng2-bootstrap';
import { TranslateModule, TranslateLoader } from 'ng2-translate';
import { SaraiNg2RoutingModule } from './app-routing.module';
import { StoreModule } from './store';
import { MapModule } from './map';

import { CookieService } from 'angular2-cookie/services/cookies.service';
import { AppLoggerService } from './app-logger.service';
import { TranslationFactoryLoader } from './app-translation-factory.service';

import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    SaraiNg2RoutingModule,
    ModalModule.forRoot(),
    TooltipModule.forRoot(),
    AccordionModule.forRoot(),
    StoreModule,
    MapModule,
    TranslateModule.forRoot({
      provide: TranslateLoader,
      useFactory: TranslationFactoryLoader,
      deps: [Http]
    })
  ],
  providers: [
    AppLoggerService,
    CookieService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }


