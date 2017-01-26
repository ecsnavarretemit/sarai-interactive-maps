/*!
 * Ndvi Map Service
 *
 * Copyright(c) Exequiel Ceasar Navarrete <esnavarrete1@up.edu.ph>
 * Licensed under MIT
 */

import { Inject, Injectable } from '@angular/core';
import { Headers, Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { MAP_CONFIG } from './map.config';
import * as L from 'leaflet';
import 'rxjs/add/operator/map';

@Injectable()
export class NdviMapService {

  constructor(
    @Inject(MAP_CONFIG) private _config: any,
    private _http: Http
  ) { }

  getNdviTimeSeriesByLatLng(coords: L.LatLngLiteral, startDate: string, endDate: string): Observable<any> {
    const endpoint = `${this._config.ndvi_maps.eeApiEndpoint}/time-series/${coords.lat}/${coords.lng}/${startDate}/${endDate}`;

    // assemble the request headers
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');

    return this._http
      .get(endpoint, {
        headers
      })
      .map((res: Response) => res.json())
      ;
  }

}


