/*!
 * App Module
 *
 * Copyright(c) Exequiel Ceasar Navarrete <esnavarrete1@up.edu.ph>
 * Licensed under MIT
 */

import { BrowserModule, Title } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule, Http } from '@angular/http';
import { ModalModule } from 'ng2-bootstrap/modal';
import { TooltipModule } from 'ng2-bootstrap/tooltip';
import { AccordionModule } from 'ng2-bootstrap/accordion';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { Angulartics2Module, Angulartics2GoogleAnalytics } from 'angulartics2';
import { SaraiInteractiveMapsRoutingModule } from './app-routing.module';
import { StoreModule } from './store';
import { MapModule } from './map';
import { UiModule } from './ui';
import { SharedModule } from './shared';

import { CookieService, CookieOptions } from 'angular2-cookie/core';
import { TranslationFactoryLoader } from './app-translation-factory.service';
import { AppConfig, APP_CONFIG } from './app.config';

import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    HttpModule,
    SaraiInteractiveMapsRoutingModule,
    ModalModule.forRoot(),
    TooltipModule.forRoot(),
    AccordionModule.forRoot(),
    StoreModule,
    MapModule,
    UiModule,
    SharedModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: TranslationFactoryLoader,
        deps: [Http]
      }
    }),
    Angulartics2Module.forRoot([
      Angulartics2GoogleAnalytics
    ])
  ],
  providers: [
    CookieService,
    Title,

    // must be present here when using AOT compilation for Angular 2.4.x or greater or else
    // the compiled code will throw error: `No provider for CookieOptions!`
    //
    // Reference: <https://github.com/salemdar/angular2-cookie/issues/37>
    { provide: CookieOptions, useValue: {} },
    { provide: APP_CONFIG, useValue: AppConfig }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }


