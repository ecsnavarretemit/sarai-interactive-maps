/*!
 * Leaflet Map Component
 *
 * Copyright(c) Exequiel Ceasar Navarrete <esnavarrete1@up.edu.ph>
 * Licensed under MIT
 */

import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { Map } from 'leaflet';
import { LeafletMapService } from '../leaflet-map.service';

@Component({
  selector: 'app-leaflet-map',
  templateUrl: './leaflet-map.component.html',
  styleUrls: ['./leaflet-map.component.sass']
})
export class LeafletMapComponent implements OnInit {
  @Input() lat: number;
  @Input() lng: number;
  @Input() zoom: number;
  @ViewChild('mapEl') mapEl: ElementRef;

  constructor(
    private _mapService: LeafletMapService
  ) {}

  ngOnInit() {
    // create the map instance
    this._mapService.createMap(this.mapEl.nativeElement, {
      zoomControl: false
    });

    this._mapService
      .getMap()
      .then((map: Map) => {
        map.setView([this.lat, this.lng], this.zoom);
      });
  }

}


