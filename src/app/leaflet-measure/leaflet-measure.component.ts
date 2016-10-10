/*!
 * Leaflet Measure Component
 *
 * Copyright(c) Exequiel Ceasar Navarrete <esnavarrete1@up.edu.ph>
 * Licensed under MIT
 */

import { Component, OnInit, ViewChild } from '@angular/core';
import { Map, Control } from 'leaflet';
import { LeafletMapService } from '../leaflet-map.service';
import 'leaflet-measure/dist/leaflet-measure';

@Component({
  selector: 'app-leaflet-measure',
  templateUrl: './leaflet-measure.component.html',
  styleUrls: ['./leaflet-measure.component.sass']
})
export class LeafletMeasureComponent implements OnInit {
  public control: Control;

  @ViewChild('controlwrapper') controlWrapper;

  constructor(private mapService: LeafletMapService) { }

  ngOnInit() {
    this.control = new (L as any).Control.Measure({
        primaryLengthUnit: 'kilometers',
        secondaryLengthUnit: 'meters',
        primaryAreaUnit: 'hectares',
        activeColor: '#ffffff',
        completedColor: '#ffffff'
    });

    this.mapService
      .getMap()
      .then((map: Map) => {
        // add to the wrapper
        this.controlWrapper.nativeElement.appendChild(this.control.onAdd(map));
      })
      ;
  }

}


