/*!
 * Leaflet WMS Layer Component
 *
 * Copyright(c) Exequiel Ceasar Navarrete <esnavarrete1@up.edu.ph>
 * Licensed under MIT
 */

import { Component, OnInit, Input } from '@angular/core';
import { LeafletMapService } from '../leaflet-map.service';
import { Map, WMS, WMSOptions } from 'leaflet';

@Component({
  selector: 'app-leaflet-wms-layer',
  templateUrl: './leaflet-wms-layer.component.html',
  styleUrls: ['./leaflet-wms-layer.component.sass']
})
export class LeafletWmsLayerComponent implements OnInit {
  public layer: WMS;
  private _layerAdded: boolean = false;

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
        // store the generated layer
        this.layer = layer;

        // set the flag to true
        this._layerAdded = true;
      })
      ;
  }

  toggleLayer() {
    this._mapService
      .getMap()
      .then((map: Map) => {
        if (typeof this.layer === 'undefined') {
          throw new Error('Layer has not been processed and added yet!.');
        }

        // remove the layer if it is already added,
        // else add it back to the map.
        if (this._layerAdded) {
          map.removeLayer(this.layer);
        } else {
          map.addLayer(this.layer);
        }

        // toggle the value of the flag between true and false
        this._layerAdded = !this._layerAdded;
      })
      ;
  }

}


