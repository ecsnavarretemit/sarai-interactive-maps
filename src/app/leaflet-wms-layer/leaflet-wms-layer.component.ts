/*!
 * Leaflet WMS Layer Component
 *
 * Copyright(c) Exequiel Ceasar Navarrete <esnavarrete1@up.edu.ph>
 * Licensed under MIT
 */

import { Component, OnInit, Input } from '@angular/core';
import { LeafletMapService } from '../leaflet-map.service';
import { WMS, WMSOptions } from 'leaflet';

@Component({
  selector: 'app-leaflet-wms-layer',
  templateUrl: './leaflet-wms-layer.component.html',
  styleUrls: ['./leaflet-wms-layer.component.sass']
})
export class LeafletWmsLayerComponent implements OnInit {
  public layer: WMS;

  @Input() url: string;
  @Input() layerOptions: WMSOptions;

  constructor(private _mapService: LeafletMapService) {}

  ngOnInit() {
    if (typeof this.url === 'undefined') {
      throw new Error('WMS Tile URL should be provided.');
    }

    if (typeof this.layerOptions === 'undefined') {
      throw new Error('WMS Option should be provided.');
    }

    this._mapService
      .addWMSLayer(this.url, this.layerOptions)
      .then((layer: WMS) => {
        this.layer = layer;

        console.log(layer);
      })
      ;
  }

}


