/*!
 * Leaflet Map Component
 *
 * Copyright(c) Exequiel Ceasar Navarrete <esnavarrete1@up.edu.ph>
 * Licensed under MIT
 */

import { AfterViewInit, Component, ElementRef, Input, TemplateRef, ViewChild } from '@angular/core';
import { LeafletMapService } from '../leaflet-map.service';
import * as L from 'leaflet';

@Component({
  selector: 'app-leaflet-map',
  templateUrl: './leaflet-map.component.html',
  styleUrls: ['./leaflet-map.component.sass']
})
export class LeafletMapComponent implements AfterViewInit {
  @Input() lat: number;
  @Input() lng: number;
  @Input() zoom: number;
  @ViewChild('mapEl') mapEl: ElementRef;

  constructor(
    private _mapService: LeafletMapService
  ) { }

  ngAfterViewInit() {
    // create the map instance
    this._mapService.createMap(this.mapEl.nativeElement, {
      zoomControl: false
    });

    this._mapService
      .getMap()
      .then((map: L.Map) => {
        map.setView([this.lat, this.lng], this.zoom);
      })
      ;
  }

}


