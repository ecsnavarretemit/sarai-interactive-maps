/*!
 * Leaflet Geocoder Component
 *
 * Copyright(c) Exequiel Ceasar Navarrete <esnavarrete1@up.edu.ph>
 * Licensed under MIT
 */

import { Component, OnInit, ViewChild } from '@angular/core';
import { Map, Control } from 'leaflet';
import { LeafletMapService } from '../leaflet-map.service';
import 'leaflet-control-geocoder2';

@Component({
  selector: 'app-leaflet-geocoder',
  templateUrl: './leaflet-geocoder.component.html',
  styleUrls: ['./leaflet-geocoder.component.sass']
})
export class LeafletGeocoderComponent implements OnInit {
  public control: Control;

  @ViewChild('controlwrapper') controlWrapper;

  constructor(private mapService: LeafletMapService) { }

  ngOnInit() {
    // prevent 'Control' is not a propery of L
    let controlObj = (L as any).Control;

    this.control = controlObj
      .geocoder({
        collapsed: false,
        placeholder: 'Find a place...',
        geocoder: new controlObj.Geocoder.Nominatim({
          geocodingQueryParams: {
            countrycodes: 'ph'
          }
        })
      })
      ;

    this.mapService
      .getMap()
      .then((map: Map) => {
        // add to the wrapper
        this.controlWrapper.nativeElement.appendChild(this.control.onAdd(map));
      })
      ;
  }

}


