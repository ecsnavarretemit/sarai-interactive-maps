/*!
 * Leaflet Map Service
 *
 * Copyright(c) Exequiel Ceasar Navarrete <esnavarrete1@up.edu.ph>
 * Licensed under MIT
 */

import { Injectable } from '@angular/core';
import { Map, MapOptions } from 'leaflet';

@Injectable()
export class LeafletMapService {
  private _map: Promise<Map>;
  private _mapResolver: (value?: Map) => void;

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

}


