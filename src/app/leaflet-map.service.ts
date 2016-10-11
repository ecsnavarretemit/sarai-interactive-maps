/*!
 * Leaflet Map Service
 *
 * Copyright(c) Exequiel Ceasar Navarrete <esnavarrete1@up.edu.ph>
 * Licensed under MIT
 */

import { Injectable } from '@angular/core';
import { Map, MapOptions, WMS } from 'leaflet';

@Injectable()
export class LeafletMapService {
  private _map: Promise<Map>;
  private _mapResolver: (value?: Map) => void;
  private _wmsLayers: Array<WMS> = [];

  constructor() {
    this._map = new Promise<Map>((resolve: () => void) => {
      this._mapResolver = resolve;
    });
  }

  createMap(el: HTMLElement, mapOptions: MapOptions): Promise<void> {
    return Promise.resolve().then(() => {
      const map = L.map(el, mapOptions);
      this._mapResolver(<Map>map);
      return;
    });
  }

  getMap(): Promise<Map> { return this._map; }

  addSingleWMSLayer(layer: WMS): Promise<WMS> {
    return this.getMap()
      .then((map: Map) => {
        // remove any existing layers
        this._wmsLayers.forEach((value: WMS) => {
          map.removeLayer(value);
        });

        // set the layers to empty array
        this._wmsLayers = [];

        // add the layer to the map
        map.addLayer(layer);

        // save the reference of the layer to the layers propery
        this._wmsLayers.push(layer);

        // return the layer
        return layer;
      });
  }

  getWMSLayers(): Promise<Array<WMS>> {
    return this.getMap()
      .then((map: Map) => {
        return this._wmsLayers;
      });
  }

}


