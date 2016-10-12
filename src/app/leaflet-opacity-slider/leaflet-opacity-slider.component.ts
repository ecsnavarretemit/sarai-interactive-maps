/*!
 * Leaflet Opacity Slider Component
 *
 * Copyright(c) Exequiel Ceasar Navarrete <esnavarrete1@up.edu.ph>
 * Licensed under MIT
 */

import { Component, OnInit, ViewChild, ElementRef, Input } from '@angular/core';
import { WMS } from 'leaflet';
import { LeafletMapService } from '../leaflet-map.service';

@Component({
  selector: 'app-leaflet-opacity-slider',
  templateUrl: './leaflet-opacity-slider.component.html',
  styleUrls: ['./leaflet-opacity-slider.component.sass']
})
export class LeafletOpacitySliderComponent implements OnInit {
  @Input() title: string = 'Layer Overlay Opacity';
  @Input() opacity: number = 1;
  @ViewChild('controlwrapper') controlWrapper;
  @ViewChild('range') range: ElementRef;

  constructor(private _mapService: LeafletMapService) {}

  ngOnInit() {
    // reflect the default value
    this.range.nativeElement.value = this.opacity;

    // set the default opacity
    this.setOpacity(this.opacity);
  }

  setOpacity(opacity: number) {
    this._mapService
      .getWMSLayers()
      .then((layers: any) => {
        _.each(layers, (layer: WMS) => {
          layer.setOpacity(opacity);
        });
      })
      ;
  }

  adjustOpacity(event) {
    this.setOpacity(this.range.nativeElement.value);
  }

}


