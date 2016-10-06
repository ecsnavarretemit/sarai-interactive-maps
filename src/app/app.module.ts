import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { StoreModule } from '@ngrx/store';
import { TooltipModule } from 'ng2-bootstrap/ng2-bootstrap';

import { mapReducer } from './map.state';
import { LeafletTileProviderService } from './leaflet-tile-provider.service';

import { AppComponent } from './app.component';
import { LeafletMapComponent } from './leaflet-map/leaflet-map.component';
import { LeafletTileSelectorComponent } from './leaflet-tile-selector/leaflet-tile-selector.component';
import { LeafletGeocoderComponent } from './leaflet-geocoder/leaflet-geocoder.component';
import { LeafletZoomComponent } from './leaflet-zoom/leaflet-zoom.component';
import { LeafletMeasureComponent } from './leaflet-measure/leaflet-measure.component';

@NgModule({
  declarations: [
    AppComponent,
    LeafletMapComponent,
    LeafletTileSelectorComponent,
    LeafletGeocoderComponent,
    LeafletZoomComponent,
    LeafletMeasureComponent
  ],
  imports: [
    BrowserModule,
    HttpModule,
    TooltipModule,
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
    LeafletTileProviderService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }


