/*!
 * Leaflet Map Component
 *
 * Copyright(c) Exequiel Ceasar Navarrete <esnavarrete1@up.edu.ph>
 * Licensed under MIT
 */

import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { Map } from 'leaflet';
import { LeafletMapService } from '../leaflet-map.service';
import { LeafletTileProviderService } from '../leaflet-tile-provider.service';

@Component({
  selector: 'app-leaflet-map',
  templateUrl: './leaflet-map.component.html',
  styleUrls: ['./leaflet-map.component.sass']
})
export class LeafletMapComponent implements OnInit {
  @Input() lat: number;
  @Input() lng: number;
  @Input() zoom: number;
  @ViewChild('mapEl') mapEl;

  constructor(
    public store: Store<any>,
    private mapService: LeafletMapService,
    private tileProvider: LeafletTileProviderService
  ) {}

  ngOnInit() {
    // create the map instance
    this.mapService.createMap(this.mapEl.nativeElement, {
      zoomControl: false
    });

    this.mapService
      .getMap()
      .then((map: Map) => {
        map.setView([this.lat, this.lng], this.zoom);
      });
  }

}


