/*!
 * Leaflet Map Service
 *
 * Copyright(c) Exequiel Ceasar Navarrete <esnavarrete1@up.edu.ph>
 * Licensed under MIT
 */

import { Injectable } from '@angular/core';
import { Map, MapOptions, WMS, WMSOptions } from 'leaflet';
import * as _ from 'lodash';

@Injectable()
export class LeafletMapService {
  private _map: Promise<Map>;
  private _mapResolver: (value?: Map) => void;
  private _wmsLayers: any = {};

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

  addWMSLayer(id: string, url: string, options: WMSOptions): Promise<WMS> {
    return this.getMap()
      .then((map: Map) => {
        if (_.has(this._wmsLayers, id)) {
          throw new Error('ID already exists. Provide another ID for this layer');
        }

        let layer = (L as any).tileLayer.wms(url, options);

        // add the layer to the map
        map.addLayer(layer);

        // save the reference of the layer to the layers propery
        this._wmsLayers[id] = layer;

        // return the layer
        return layer;
      })
      ;
  }

  addWMSLayers(url: string, items: Array<{id: string, options: WMSOptions}>): Promise<Array<WMS>> {
    return this.getMap()
      .then((map: Map) => {
        let layers = _.chain(items)
          .filter((item) => {
            let result = _.has(this._wmsLayers, item.id);

            if (result) {
              throw new Error(`ID ${item.id} exists. please provide a new ID for this layer.`);
            }

            return !result;
          })
          .map((item) => {
            let layer = (L as any).tileLayer.wms(url, item.options);

            // the created layer to the map
            map.addLayer(layer);

            // store the key and its layer to the key-value store
            this._wmsLayers[item.id] = layer;

            return layer;
          })
          .value()
          ;

        console.log(layers);

        return layers;
      })
      ;
  }

  clearWMSLayers(): Promise<void> {
    return this.getMap()
      .then((map: Map) => {
        // remove any existing layers
        _.each(this._wmsLayers, (value: WMS, id: string) => {
          map.removeLayer(value);
        });

        // set the layers to empty array
        this._wmsLayers = {};
      })
      ;
  }

  removeWMSLAyer(id: string): Promise<void> {
    return this.getMap()
      .then((map: Map) => {
        map.removeLayer(this._wmsLayers[id]);

        // remove the property from the object store.
        delete this._wmsLayers[id];
      })
      ;
  }

  getWMSLayers(): Promise<any> {
    return this.getMap()
      .then((map: Map) => {
        return this._wmsLayers;
      });
  }

}


