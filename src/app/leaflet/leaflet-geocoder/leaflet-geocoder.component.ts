/*!
 * Leaflet Geocoder Component
 *
 * Copyright(c) Exequiel Ceasar Navarrete <esnavarrete1@up.edu.ph>
 * Licensed under MIT
 */

import { Component, OnInit, OnChanges, ViewChild, Input, ElementRef, Renderer } from '@angular/core';
import { LeafletMapService } from '../leaflet-map.service';
import * as L from 'leaflet';
import 'leaflet-control-geocoder2';

@Component({
  selector: 'app-leaflet-geocoder',
  templateUrl: './leaflet-geocoder.component.html',
  styleUrls: ['./leaflet-geocoder.component.sass']
})
export class LeafletGeocoderComponent implements OnInit, OnChanges {
  public control: L.Control;

  @Input() placeholder: string = 'Find a place...';
  @ViewChild('controlwrapper') controlWrapper: ElementRef;

  constructor(
    private _mapService: LeafletMapService,
    private _renderer: Renderer
  ) { }

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
      .then((map: L.Map) => {
        let container = this.control.onAdd(map);

        // append the element container to the controlWrapper
        this._renderer.invokeElementMethod(this.controlWrapper.nativeElement, 'appendChild', [
          container
        ]);
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


