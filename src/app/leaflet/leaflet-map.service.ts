/*!
 * Leaflet Map Service
 *
 * Copyright(c) Exequiel Ceasar Navarrete <esnavarrete1@up.edu.ph>
 * Licensed under MIT
 */

import { Injectable } from '@angular/core';
import each from 'lodash-es/each';
import filter from 'lodash-es/filter';
import has from 'lodash-es/has';
import map from 'lodash-es/map';
import * as L from 'leaflet';

interface LayerCollection {
  [id: string]: L.TileLayer | L.WMS;
}

@Injectable()
export class LeafletMapService {
  private _leafletApi: any = L;
  private _map: Promise<L.Map>;
  private _mapResolver: (value?: L.Map) => void;
  private _wmsLayers: LayerCollection = {};
  private _tileLayers: LayerCollection = {};

  constructor() {
    this._map = new Promise<L.Map>((resolve: () => void) => {
      this._mapResolver = resolve;
    });
  }

  createMap(el: HTMLElement, mapOptions: L.MapOptions): Promise<void> {
    return Promise.resolve().then(() => {
      const mapInstance = L.map(el, mapOptions);
      this._mapResolver(<L.Map>mapInstance);
      return;
    });
  }

  getMap(): Promise<L.Map> { return this._map; }

  panTo(lat: number, lng: number, zoom?: number): Promise<L.Map> {
    return this._map
      .then((mapInstance: L.Map) => {
        if (typeof zoom === 'undefined') {
          zoom = 6;
        }

        mapInstance.setView([lat, lng], zoom);
      })
      ;
  }

  addTileLayer(id: string, layer: L.TileLayer): Promise<void | Error> {
    return this.getMap()
      .then((mapInstance: L.Map) => {
        if (has(this._tileLayers, id)) {
          return Promise.reject(new Error(`ID ${id} already exists. Provide another ID for this layer`));
        }

        // add the layer to the map
        mapInstance.addLayer(layer);

        // save the reference of the layer to the layers propery
        this._tileLayers[id] = layer;
      })
      ;
  }

  addNewTileLayer(id: string, url: string, options: L.TileLayerOptions): Promise<L.TileLayer | Error> {
    return this.getMap()
      .then((mapInstance: L.Map) => {
        if (has(this._tileLayers, id)) {
          return Promise.reject(new Error(`ID ${id} already exists. Provide another ID for this layer`));
        }

        const layer = this._leafletApi.tileLayer(url, options);

        // add the layer to the map
        mapInstance.addLayer(layer);

        // save the reference of the layer to the layers propery
        this._tileLayers[id] = layer;

        // return the layer
        return layer;
      })
      ;
  }

  removeTileLayer(id: string): Promise<void | Error> {
    return this.getMap()
      .then((mapInstance: L.Map) => {
        if (!has(this._tileLayers, id)) {
          return Promise.reject(new Error(`ID ${id} does not exist. Cannot remove tile layer.`));
        }

        mapInstance.removeLayer(this._tileLayers[id]);

        // remove the property from the object store.
        delete this._tileLayers[id];
      })
      ;
  }

  clearTileLayers(): Promise<void> {
    return this.getMap()
      .then((mapInstance: L.Map) => {
        // remove any existing layers
        each(this._tileLayers, (value: L.TileLayer, id: string) => {
          mapInstance.removeLayer(value);
        });

        // set the layers to empty array
        this._tileLayers = {};
      })
      ;
  }

  addWMSLayer(id: string, layer: L.WMS): Promise<void | Error> {
    return this.getMap()
      .then((mapInstance: L.Map) => {
        if (has(this._wmsLayers, id)) {
          return Promise.reject(new Error(`ID ${id} already exists. Provide another ID for this layer`));
        }

        // add the layer to the map
        mapInstance.addLayer(layer);

        // save the reference of the layer to the layers propery
        this._wmsLayers[id] = layer;
      })
      ;
  }

  addNewWMSLayer(id: string, url: string, options: L.WMSOptions): Promise<L.WMS | Error> {
    return this.getMap()
      .then((mapInstance: L.Map) => {
        if (has(this._wmsLayers, id)) {
          return Promise.reject(new Error(`ID ${id} already exists. Provide another ID for this layer`));
        }

        const layer = this._leafletApi.tileLayer.wms(url, options);

        // add the layer to the map
        mapInstance.addLayer(layer);

        // save the reference of the layer to the layers propery
        this._wmsLayers[id] = layer;

        // return the layer
        return layer;
      })
      ;
  }

  addNewWMSLayers(url: string, items: Array<{id: string, options: L.WMSOptions}>): Promise<Array<L.WMS>> {
    return this.getMap()
      .then((mapInstance: L.Map) => {
        let layers = filter(items, (item) => {
          const result = has(this._wmsLayers, item.id);

          return !result;
        });

        layers = map(layers, (item) => {
          const layer = this._leafletApi.tileLayer.wms(url, item.options);

          // the created layer to the map
          mapInstance.addLayer(layer);

          // store the key and its layer to the key-value store
          this._wmsLayers[item.id] = layer;

          return layer;
        });

        return layers;
      })
      ;
  }

  clearWMSLayers(): Promise<void> {
    return this.getMap()
      .then((mapInstance: L.Map) => {
        // remove any existing layers
        each(this._wmsLayers, (value: L.WMS, id: string) => {
          mapInstance.removeLayer(value);
        });

        // set the layers to empty array
        this._wmsLayers = {};
      })
      ;
  }

  removeWMSLayer(id: string): Promise<void | Error> {
    return this.getMap()
      .then((mapInstance: L.Map) => {
        if (!has(this._wmsLayers, id)) {
          return Promise.reject(new Error(`ID ${id} does not exist. Cannot remove WMS layer.`));
        }

        mapInstance.removeLayer(this._wmsLayers[id]);

        // remove the property from the object store.
        delete this._wmsLayers[id];
      })
      ;
  }

  getWMSLayers(): Promise<any> {
    return this.getMap()
      .then((mapInstance: L.Map) => {
        return this._wmsLayers;
      })
      ;
  }

  getTileLayers(): Promise<any> {
    return this.getMap()
      .then((mapInstance: L.Map) => {
        return this._tileLayers;
      })
      ;
  }

}


