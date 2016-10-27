/*!
 * Leaflet Geocoder Component
 *
 * Copyright(c) Exequiel Ceasar Navarrete <esnavarrete1@up.edu.ph>
 * Licensed under MIT
 */

import { Component, OnInit, OnChanges, ViewChild, Input, ElementRef } from '@angular/core';
import { Map, Control } from 'leaflet';
import { LeafletMapService } from '../leaflet-map.service';
import 'leaflet-control-geocoder2';

@Component({
  selector: 'app-leaflet-geocoder',
  templateUrl: './leaflet-geocoder.component.html',
  styleUrls: ['./leaflet-geocoder.component.sass']
})
export class LeafletGeocoderComponent implements OnInit, OnChanges {
  public control: Control;

  @Input() placeholder: string = 'Find a place...';
  @ViewChild('controlwrapper') controlWrapper: ElementRef;

  constructor(private _mapService: LeafletMapService) { }

  ngOnInit() {
    // prevent 'Control' is not a propery of L
    let controlObj = (L as any).Control;

    this.control = controlObj
      .geocoder({
        collapsed: false,
        placeholder: this.placeholder,
        geocoder: new controlObj.Geocoder.Nominatim({
          geocodingQueryParams: {
            countrycodes: 'ph'
          }
        })
      })
      ;

    this._mapService
      .getMap()
      .then((map: Map) => {
        // add to the wrapper
        this.controlWrapper.nativeElement.appendChild(this.control.onAdd(map));
      })
      ;
  }

  ngOnChanges(changes) {
    // detect the change on the placeholder input
    if (typeof this.control !== 'undefined') {
      (this.control as any)._input.placeholder = changes.placeholder.currentValue;
    }
  }

}


