import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { Store, StoreModule } from '@ngrx/store';
import { TooltipModule } from 'ng2-bootstrap/ng2-bootstrap';

import { AppComponent } from './app.component';
import { LeafletMapComponent } from './leaflet-map/leaflet-map.component';

import { LeafletTileProviderService } from './leaflet-tile-provider.service';
import { LeafletTileSelectorComponent } from './leaflet-tile-selector/leaflet-tile-selector.component';

import { mapReducer } from './map.state';

@NgModule({
  declarations: [
    AppComponent,
    LeafletMapComponent,
    LeafletTileSelectorComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
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
