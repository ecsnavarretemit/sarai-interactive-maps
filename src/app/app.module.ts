/*!
 * App Module
 *
 * Copyright(c) Exequiel Ceasar Navarrete <esnavarrete1@up.edu.ph>
 * Licensed under MIT
 */

import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { StoreModule } from '@ngrx/store';
import { TooltipModule, AccordionModule } from 'ng2-bootstrap/ng2-bootstrap';
import { SaraiNg2RoutingModule } from './app-routing.module';

import { mapReducer } from './map.state';
import { WmsLayerService } from './wms-layer.service';
import { LeafletMapService } from './leaflet-map.service';
import { LeafletTileProviderService } from './leaflet-tile-provider.service';

import { AppComponent } from './app.component';
import { LeafletMapComponent } from './leaflet-map/leaflet-map.component';
import { LeafletTileSelectorComponent } from './leaflet-tile-selector/leaflet-tile-selector.component';
import { LeafletGeocoderComponent } from './leaflet-geocoder/leaflet-geocoder.component';
import { LeafletZoomComponent } from './leaflet-zoom/leaflet-zoom.component';
import { LeafletMeasureComponent } from './leaflet-measure/leaflet-measure.component';
import { LeafletButtonComponent } from './leaflet-button/leaflet-button.component';
import { LeafletWmsLayerComponent } from './leaflet-wms-layer/leaflet-wms-layer.component';
import { LeafletControlPanelComponent } from './leaflet-control-panel/leaflet-control-panel.component';
import { LeafletOpacitySliderComponent } from './leaflet-opacity-slider/leaflet-opacity-slider.component';
import { MapTypeComponent } from './map-type/map-type.component';
import { HomeComponent } from './home/home.component';
import { SuitabilityMapsComponent } from './suitability-maps/suitability-maps.component';
import { SuitabilityMapPanelComponent } from './suitability-map-panel/suitability-map-panel.component';
import { CropProductionAreaPanelComponent } from './crop-production-area-panel/crop-production-area-panel.component';

@NgModule({
  declarations: [
    AppComponent,
    LeafletMapComponent,
    LeafletTileSelectorComponent,
    LeafletGeocoderComponent,
    LeafletZoomComponent,
    LeafletMeasureComponent,
    LeafletButtonComponent,
    LeafletWmsLayerComponent,
    LeafletControlPanelComponent,
    LeafletOpacitySliderComponent,
    MapTypeComponent,
    HomeComponent,
    SuitabilityMapsComponent,
    SuitabilityMapPanelComponent,
    CropProductionAreaPanelComponent
  ],
  imports: [
    BrowserModule,
    SaraiNg2RoutingModule,
    HttpModule,
    TooltipModule,
    AccordionModule,
    StoreModule.provideStore({
      map: mapReducer
    }, {
      map: {
        center: null,
        zoom: null,
        tileProvider: null
      }
    })
  ],
  providers: [
    LeafletMapService,
    LeafletTileProviderService,
    WmsLayerService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }


