/* tslint:disable:no-unused-variable */

/*!
 * App Component Test
 *
 * Copyright(c) Exequiel Ceasar Navarrete <esnavarrete1@up.edu.ph>
 * Licensed under MIT
 */

import { TestBed, async } from '@angular/core/testing';
import { APP_BASE_HREF } from '@angular/common';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule, Http } from '@angular/http';
import { StoreModule } from '@ngrx/store';
import { TooltipModule, AccordionModule, ModalModule } from 'ng2-bootstrap/ng2-bootstrap';
import { TranslateModule, TranslateLoader, TranslateStaticLoader } from 'ng2-translate';
import { SaraiNg2RoutingModule } from './app-routing.module';

import { CookieService } from 'angular2-cookie/services/cookies.service';
import { WindowService } from './window.service';
import { AppConfig, APP_CONFIG } from './app.config';
import { AppLoggerService } from './app-logger.service';
import { TileLayerService } from './tile-layer.service';
import { SuitabilityMapService } from './suitability-map.service';
import { LeafletMapService } from './leaflet-map.service';
import { LeafletTileProviderService } from './leaflet-tile-provider.service';

import { MapLayersReducer, SuitabilityLevelsReducer } from './store';

import { LeafletMapComponent } from './leaflet-map/leaflet-map.component';
import { LeafletTileSelectorComponent } from './leaflet-tile-selector/leaflet-tile-selector.component';
import { LeafletGeocoderComponent } from './leaflet-geocoder/leaflet-geocoder.component';
import { LeafletZoomComponent } from './leaflet-zoom/leaflet-zoom.component';
import { LeafletMeasureComponent } from './leaflet-measure/leaflet-measure.component';
import { LeafletButtonComponent } from './leaflet-button/leaflet-button.component';
import { LeafletWmsLayerComponent } from './leaflet-wms-layer/leaflet-wms-layer.component';
import { LeafletOpacitySliderComponent } from './leaflet-opacity-slider/leaflet-opacity-slider.component';
import { LeafletSidebarComponent } from './leaflet-sidebar/leaflet-sidebar.component';
import { HomeComponent } from './home/home.component';
import { SuitabilityMapsComponent } from './suitability-maps/suitability-maps.component';
import { SuitabilityMapPanelComponent } from './suitability-map-panel/suitability-map-panel.component';
import { CropProductionAreaPanelComponent } from './crop-production-area-panel/crop-production-area-panel.component';
import { NdviPanelComponent } from './ndvi-panel/ndvi-panel.component';
import { RainfallMapPanelComponent } from './rainfall-map-panel/rainfall-map-panel.component';
import { DownloadImageFormComponent } from './download-image-form/download-image-form.component';
import { NdviMapsComponent } from './ndvi-maps/ndvi-maps.component';
import { RainfallMapsComponent } from './rainfall-maps/rainfall-maps.component';

import { AppComponent } from './app.component';

describe('App: SaraiNg2', () => {

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        SaraiNg2RoutingModule,
        FormsModule,
        ReactiveFormsModule,
        HttpModule,
        TooltipModule,
        AccordionModule,
        ModalModule,
        TranslateModule.forRoot({
          provide: TranslateLoader,
          useFactory: (http: Http) => new TranslateStaticLoader(http, '/assets/i18n', '.json'),
          deps: [Http]
        }),
        StoreModule.provideStore({
          mapLayers: MapLayersReducer,
          suitabilityLevels: SuitabilityLevelsReducer
        })
      ],

      declarations: [
        AppComponent,
        LeafletMapComponent,
        LeafletTileSelectorComponent,
        LeafletGeocoderComponent,
        LeafletZoomComponent,
        LeafletMeasureComponent,
        LeafletButtonComponent,
        LeafletWmsLayerComponent,
        LeafletOpacitySliderComponent,
        LeafletSidebarComponent,
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

      providers: [
        AppLoggerService,
        CookieService,
        LeafletMapService,
        LeafletTileProviderService,
        TileLayerService,
        SuitabilityMapService,

        // using window object in Angular 2 is discouraged since
        // it isn’t only designed to run within your browser, but also on mobiles,
        // the server or web workers where objects like window may not be available.
        { provide: WindowService, useValue: window },
        { provide: APP_CONFIG, useValue: AppConfig },
        { provide: APP_BASE_HREF, useValue: '/' }
      ]
    });
  });

  it('should create the app', async(() => {
    let fixture = TestBed.createComponent(AppComponent);
    let app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));

});


