/*!
 * Leaflet Map Service
 *
 * Copyright(c) Exequiel Ceasar Navarrete <esnavarrete1@up.edu.ph>
 * Licensed under MIT
 */

import { Injectable } from '@angular/core';
import { Map, MapOptions, TileLayer, TileLayerOptions, WMS, WMSOptions } from 'leaflet';
import * as _ from 'lodash';

interface LayerCollection {
  [id: string]: TileLayer | WMS;
}

@Injectable()
export class LeafletMapService {
  private _map: Promise<Map>;
  private _mapResolver: (value?: Map) => void;
  private _wmsLayers: LayerCollection = {};
  private _tileLayers: LayerCollection = {};

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

  addTileLayer(id: string, layer: TileLayer): Promise<void | Error> {
    return this.getMap()
      .then((map: Map) => {
        if (_.has(this._tileLayers, id)) {
          return Promise.reject(new Error(`ID ${id} already exists. Provide another ID for this layer`));
        }

        // add the layer to the map
        map.addLayer(layer);

        // save the reference of the layer to the layers propery
        this._tileLayers[id] = layer;
      })
      ;
  }

  addNewTileLayer(id: string, url: string, options: TileLayerOptions): Promise<TileLayer | Error> {
    return this.getMap()
      .then((map: Map) => {
        if (_.has(this._tileLayers, id)) {
          return Promise.reject(new Error(`ID ${id} already exists. Provide another ID for this layer`));
        }

        let layer = (L as any).tileLayer(url, options);

        // add the layer to the map
        map.addLayer(layer);

        // save the reference of the layer to the layers propery
        this._tileLayers[id] = layer;

        // return the layer
        return layer;
      })
      ;
  }

  removeTileLayer(id: string): Promise<void | Error> {
    return this.getMap()
      .then((map: Map) => {
        if (!_.has(this._tileLayers, id)) {
          return Promise.reject(new Error(`ID ${id} does not exist. Cannot remove tile layer.`));
        }

        map.removeLayer(this._tileLayers[id]);

        // remove the property from the object store.
        delete this._tileLayers[id];
      })
      ;
  }

  clearTileLayers(): Promise<void> {
    return this.getMap()
      .then((map: Map) => {
        // remove any existing layers
        _.each(this._tileLayers, (value: TileLayer, id: string) => {
          map.removeLayer(value);
        });

        // set the layers to empty array
        this._tileLayers = {};
      })
      ;
  }

  addWMSLayer(id: string, layer: WMS): Promise<void | Error> {
    return this.getMap()
      .then((map: Map) => {
        if (_.has(this._wmsLayers, id)) {
          return Promise.reject(new Error(`ID ${id} already exists. Provide another ID for this layer`));
        }

        // add the layer to the map
        map.addLayer(layer);

        // save the reference of the layer to the layers propery
        this._wmsLayers[id] = layer;
      })
      ;
  }

  addNewWMSLayer(id: string, url: string, options: WMSOptions): Promise<WMS | Error> {
    return this.getMap()
      .then((map: Map) => {
        if (_.has(this._wmsLayers, id)) {
          return Promise.reject(new Error(`ID ${id} already exists. Provide another ID for this layer`));
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

  addNewWMSLayers(url: string, items: Array<{id: string, options: WMSOptions}>): Promise<Array<WMS>> {
    return this.getMap()
      .then((map: Map) => {
        let layers = _.chain(items)
          .filter((item) => {
            let result = _.has(this._wmsLayers, item.id);

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

  removeWMSLayer(id: string): Promise<void | Error> {
    return this.getMap()
      .then((map: Map) => {
        if (!_.has(this._wmsLayers, id)) {
          return Promise.reject(new Error(`ID ${id} does not exist. Cannot remove WMS layer.`));
        }

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


