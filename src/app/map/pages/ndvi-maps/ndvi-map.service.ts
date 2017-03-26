/*!
 * Ndvi Map Service
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
import includes from 'lodash-es/includes';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/throw';

@Injectable()
export class NdviMapService {

  constructor(
    @Inject(MAP_CONFIG) private _config: any,
    private _http: Http
  ) { }

  getTimeSeriesByLatLngEndpoint(coords: L.LatLngLiteral, startDate: string, endDate: string, format?: string): string {
    let endpoint = `${this._config.ndvi_maps.eeApiEndpoint}/time-series/${coords.lat}/${coords.lng}/${startDate}/${endDate}`;

    // append the format to the endpoint
    if (typeof format !== 'undefined' && includes(['json', 'csv'], format)) {
      endpoint += `?fmt=${format}`;
    }

    return endpoint;
  }

  getDOYByLatLngEndpoint(coords: L.LatLngLiteral, startDate: string, endDate: string, format?: string): string {
    let endpoint = `${this._config.ndvi_maps.eeApiEndpoint}/day-of-the-year/${coords.lat}/${coords.lng}/${startDate}/${endDate}`;

    // append the format to the endpoint
    if (typeof format !== 'undefined' && includes(['json', 'csv'], format)) {
      endpoint += `?fmt=${format}`;
    }

    return endpoint;
  }

  getNdviTimeSeriesByLatLng(coords: L.LatLngLiteral, startDate: string, endDate: string): Observable<any> {
    const endpoint = this.getTimeSeriesByLatLngEndpoint(coords, startDate, endDate);

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
          return item.ndvi !== null;
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


