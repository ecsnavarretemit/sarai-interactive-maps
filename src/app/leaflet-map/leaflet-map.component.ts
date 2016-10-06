import { Component, OnInit, ElementRef, Input } from '@angular/core';
import { Store } from '@ngrx/store';
import { LeafletTileProviderService } from '../leaflet-tile-provider.service';
import * as L from 'leaflet';

@Component({
  selector: 'app-leaflet-map',
  templateUrl: './leaflet-map.component.html',
  styleUrls: ['./leaflet-map.component.sass']
})
export class LeafletMapComponent implements OnInit {
  public map: any;
  public tileProviderKey: string;

  @Input() lat:number;
  @Input() lng:number;
  @Input() zoom:number;

  constructor(
    public store: Store<any>,
    private element: ElementRef,
    private tileProvider: LeafletTileProviderService
  ) {
    this.tileProviderKey = 'Google Satellite';
  }

  ngOnInit() {
    let el = this.element.nativeElement.querySelector('.map');

    this.store
      .select('map')
      .subscribe((state: any) => {
        console.log('State Modified: ', state);

        if (typeof this.map !== 'undefined' && this.tileProviderKey !== state.tileProvider) {
          // remove the current tile provider from the map canvas
          this.map.removeLayer(this.tileProvider.baseMaps[this.tileProviderKey]);

          // add the current tile provider from the map canvas
          this.tileProvider.baseMaps[state.tileProvider].addTo(this.map);

          // store the new tile provider
          this.tileProviderKey = state.tileProvider;
        }
      })
      ;

    // store the resolved tile provider to the state manager
    this.store.dispatch({
      type: 'SET_TILE_PROVIDER',
      payload: {
        tileProvider: this.tileProviderKey
      }
    });

    // store the resolved zoom to the state manager
    this.store.dispatch({
      type: 'SET_ZOOM',
      payload: {
        zoom: this.zoom
      }
    });

    // store the resolved map center to the state manager
    this.store.dispatch({
      type: 'SET_CENTER',
      payload: {
        center: [this.lat, this.lng]
      }
    });

    // create the map instance
    this.map = L.map(el, {
      zoomControl: false
    });

    this.map.setView([this.lat, this.lng], this.zoom);

    // add the current tile provider from the map canvas
    this.tileProvider.baseMaps[this.tileProviderKey].addTo(this.map);

    // emit changes to lat and lng coordinates
    this.map.on('moveend', (e) => {
      let center = this.map.getCenter();

      this.store.dispatch({
        type: 'SET_CENTER',
        payload: {
          center: [center.lat, center.lng]
        }
      });
    });

    // emit changes to zoom
    this.map.on('zoomend', (e) => {
      let mapZoom = this.map.getZoom();

      this.store.dispatch({
        type: 'SET_ZOOM',
        payload: {
          zoom: mapZoom
        }
      });
    });
  }

  tileProviderChange(tileProvider: string) {
    // store the resolved tile provider to the state manager
    this.store.dispatch({
      type: 'SET_TILE_PROVIDER',
      payload: {
        tileProvider: tileProvider
      }
    });
  }

}


