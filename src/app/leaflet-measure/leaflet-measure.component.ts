/*!
 * Leaflet Measure Component
 *
 * Copyright(c) Exequiel Ceasar Navarrete <esnavarrete1@up.edu.ph>
 * Licensed under MIT
 */

import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { Map, Control } from 'leaflet';
import 'leaflet-measure/dist/leaflet-measure';

@Component({
  selector: 'app-leaflet-measure',
  templateUrl: './leaflet-measure.component.html',
  styleUrls: ['./leaflet-measure.component.sass']
})
export class LeafletMeasureComponent implements OnInit {
  public control: Control;

  @Input() map: Map;
  @ViewChild('controlwrapper') controlWrapper;

  constructor() { }

  ngOnInit() {
    if (typeof this.map === 'undefined') {
      throw new Error('Please provide the map first via the map attribute.');
    }

    this.control = new (L as any).Control.Measure({
        primaryLengthUnit: 'kilometers',
        secondaryLengthUnit: 'meters',
        primaryAreaUnit: 'hectares',
        activeColor: '#ffffff',
        completedColor: '#ffffff'
    });

    // add to the wrapper
    this.controlWrapper.nativeElement.appendChild(this.control.onAdd(this.map));
  }

}


