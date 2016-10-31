/*!
 * Leaflet WMS Layer Component
 *
 * Copyright(c) Exequiel Ceasar Navarrete <esnavarrete1@up.edu.ph>
 * Licensed under MIT
 */

import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { LeafletMapService } from '../leaflet-map.service';
import { WMS, WMSOptions } from 'leaflet';

@Component({
  selector: 'app-leaflet-wms-layer',
  templateUrl: './leaflet-wms-layer.component.html',
  styleUrls: ['./leaflet-wms-layer.component.sass']
})
export class LeafletWmsLayerComponent implements OnInit, OnDestroy {
  public layer: WMS;
  private _layerAdded: boolean = false;

  @Input() id: string;
  @Input() url: string;
  @Input() layerOptions: WMSOptions;

  constructor(private _mapService: LeafletMapService) {}

  ngOnInit() {
    if (typeof this.id === 'undefined') {
      throw new Error('ID should be provided for this layer.');
    }

    if (typeof this.url === 'undefined') {
      throw new Error('WMS Tile URL should be provided.');
    }

    if (typeof this.layerOptions === 'undefined') {
      throw new Error('WMS Option should be provided.');
    }

    this._mapService
      .addNewWMSLayer(this.id, this.url, this.layerOptions)
      .then((layer: WMS) => {
        // store the generated layer
        this.layer = layer;

        // set the flag to true
        this._layerAdded = true;
      })
      .catch((error: Error) => {
        console.error(error);
      })
      ;
  }

  toggleLayer(): Promise<void> {
    if (this._layerAdded) {
      return this._mapService
        .removeWMSLayer(this.id)
        .then(() => {
          this._layerAdded = false;
        })
        .catch((error: Error) => {
          console.error(error);
        })
        ;
    } else {
      return this._mapService
        .addWMSLayer(this.id, this.layer)
        .then(() => {
          this._layerAdded = true;
        })
        .catch((error: Error) => {
          console.error(error);
        })
        ;
    }
  }

  ngOnDestroy() {
    this._mapService
      .removeWMSLayer(this.id)
      .then(() => {
        if (typeof this.layer === 'undefined') {
          throw new Error('Layer has not been processed and added yet!.');
        }

        // return immediately if the layer is already removed
        if (!this._layerAdded) {
          return;
        }

        // mark the flag as false
        this._layerAdded = false;

        // remove the reference to the object
        this.layer = undefined;
      })
      .catch((error: Error) => {
        console.error(error);
      })
      ;
  }

}


