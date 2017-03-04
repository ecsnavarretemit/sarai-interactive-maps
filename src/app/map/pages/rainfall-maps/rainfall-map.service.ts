/*!
 * Rainfall Map Service
 *
 * Copyright(c) Exequiel Ceasar Navarrete <esnavarrete1@up.edu.ph>
 * Licensed under MIT
 */

import { Inject, Injectable } from '@angular/core';
import { Headers, Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { MAP_CONFIG } from '../../map.config';
import * as L from 'leaflet';
import every from 'lodash-es/every';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/throw';

@Injectable()
export class RainfallMapService {

  constructor(
    @Inject(MAP_CONFIG) private _config: any,
    private _http: Http
  ) { }

  getCumulativeRainfallByLatLng(coords: L.LatLngLiteral, startDate: string, endDate: string): Observable<any> {
    const endpoint = `${this._config.rainfall_maps.eeApiEndpoint}/cumulative-rainfall/${coords.lat}/${coords.lng}/${startDate}/${endDate}`;

    // assemble the request headers
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');

    return this._http
      .get(endpoint, {
        headers
      })
      .map((res: Response) => res.json())
      .mergeMap((data: any) => {
        const isEmpty: boolean = every(data.result, (item: any) => {
          return item.rainfall !== null;
        });

        // throw a new observable containing the error message when all ndvi value are null
        if (isEmpty === false) {
          return Observable.throw(new Error('Please click on a land surface.'));
        }

        // create a new observable out of the data
        return Observable.of(data);
      })
      ;
  }

}


