/*!
 * Leaflet Geocoder Component
 *
 * Copyright(c) Exequiel Ceasar Navarrete <esnavarrete1@up.edu.ph>
 * Licensed under MIT
 */

import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { Map, Control } from 'leaflet';
import 'leaflet-control-geocoder2';

@Component({
  selector: 'app-leaflet-geocoder',
  templateUrl: './leaflet-geocoder.component.html',
  styleUrls: ['./leaflet-geocoder.component.sass']
})
export class LeafletGeocoderComponent implements OnInit {
  public control: Control;

  @Input() map: Map;
  @ViewChild('controlwrapper') controlWrapper;

  constructor() { }

  ngOnInit() {
    if (typeof this.map === 'undefined') {
      throw new Error('Please provide the map first via the map attribute.');
    }

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

    // add to the wrapper
    this.controlWrapper.nativeElement.appendChild(this.control.onAdd(this.map));
  }

}


