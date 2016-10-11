/*!
 * Leaflet Opacity Slider Component
 *
 * Copyright(c) Exequiel Ceasar Navarrete <esnavarrete1@up.edu.ph>
 * Licensed under MIT
 */

import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { Map } from 'leaflet';
import { LeafletMapService } from '../leaflet-map.service';

@Component({
  selector: 'app-leaflet-opacity-slider',
  templateUrl: './leaflet-opacity-slider.component.html',
  styleUrls: ['./leaflet-opacity-slider.component.sass']
})
export class LeafletOpacitySliderComponent implements OnInit {
  @Input() title: string = 'Layer Overlay Opacity';
  @ViewChild('controlwrapper') controlWrapper;

  constructor(private _mapService: LeafletMapService) {}

  ngOnInit() {
    this._mapService
      .getMap()
      .then((map: Map) => {

      })
      ;
  }

}


