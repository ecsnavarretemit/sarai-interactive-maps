import { Component, OnInit, Input, ViewChild } from '@angular/core';
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

  @Input() lat: number;
  @Input() lng: number;
  @Input() zoom: number;
  @ViewChild('mapEl') mapEl;

  constructor(
    public store: Store<any>,
    private tileProvider: LeafletTileProviderService
  ) {}

  ngOnInit() {
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
    this.map = L.map(this.mapEl.nativeElement, {
      zoomControl: false
    });

    this.map.setView([this.lat, this.lng], this.zoom);

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

}


