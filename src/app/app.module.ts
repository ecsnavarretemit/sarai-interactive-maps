/*!
 * App Module
 *
 * Copyright(c) Exequiel Ceasar Navarrete <esnavarrete1@up.edu.ph>
 * Licensed under MIT
 */

import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CustomFormsModule } from 'ng2-validation';
import { HttpModule, Http } from '@angular/http';
import { StoreModule } from '@ngrx/store';
import { TooltipModule, AccordionModule, ModalModule } from 'ng2-bootstrap/ng2-bootstrap';
import { TranslateModule, TranslateLoader } from 'ng2-translate';
import { MdCheckboxModule } from '@angular2-material/checkbox';
import { SaraiNg2RoutingModule } from './app-routing.module';
import { LeafletModule } from './leaflet';

import { CookieService } from 'angular2-cookie/services/cookies.service';
import { WindowService } from './window.service';
import { AppConfig, APP_CONFIG } from './app.config';
import { AppLoggerService } from './app-logger.service';
import { TileLayerService } from './tile-layer.service';
import { SuitabilityMapService } from './suitability-map.service';

import { TranslationFactoryLoader } from './app-translation-factory.service';
import { MapLayersReducer, SuitabilityLevelsReducer } from './store';

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { SuitabilityMapsComponent } from './suitability-maps/suitability-maps.component';
import { SuitabilityMapPanelComponent } from './suitability-map-panel/suitability-map-panel.component';
import { CropProductionAreaPanelComponent } from './crop-production-area-panel/crop-production-area-panel.component';
import { NdviPanelComponent } from './ndvi-panel/ndvi-panel.component';
import { RainfallMapPanelComponent } from './rainfall-map-panel/rainfall-map-panel.component';
import { DownloadImageFormComponent } from './download-image-form/download-image-form.component';
import { NdviMapsComponent } from './ndvi-maps/ndvi-maps.component';
import { RainfallMapsComponent } from './rainfall-maps/rainfall-maps.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    SuitabilityMapsComponent,
    SuitabilityMapPanelComponent,
    CropProductionAreaPanelComponent,
    NdviPanelComponent,
    RainfallMapPanelComponent,
    DownloadImageFormComponent,
    NdviMapsComponent,
    RainfallMapsComponent
  ],
  imports: [
    BrowserModule,
    SaraiNg2RoutingModule,
    FormsModule,
    ReactiveFormsModule,
    CustomFormsModule,
    HttpModule,
    TooltipModule,
    AccordionModule,
    ModalModule,
    MdCheckboxModule,
    LeafletModule,
    TranslateModule.forRoot({
      provide: TranslateLoader,
      useFactory: TranslationFactoryLoader,
      deps: [Http]
    }),
    StoreModule.provideStore({
      mapLayers: MapLayersReducer,
      suitabilityLevels: SuitabilityLevelsReducer
    })
  ],
  providers: [
    AppLoggerService,
    CookieService,
    TileLayerService,
    SuitabilityMapService,

    // using window object in Angular 2 is discouraged since
    // it isn’t only designed to run within your browser, but also on mobiles,
    // the server or web workers where objects like window may not be available.
    { provide: WindowService, useValue: window },
    { provide: APP_CONFIG, useValue: AppConfig }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }


