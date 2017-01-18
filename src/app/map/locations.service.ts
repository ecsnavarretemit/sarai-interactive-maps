/*!
 * Locations Service
 *
 * Copyright(c) Exequiel Ceasar Navarrete <esnavarrete1@up.edu.ph>
 * Licensed under MIT
 */

import { Injectable, Inject } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { MAP_CONFIG } from './map.config';
import trimEnd from 'lodash-es/trimEnd';
import 'rxjs/add/operator/map';

@Injectable()
export class LocationsService {

  constructor(
    @Inject(MAP_CONFIG) private _config: any,
    private _http: Http
  ) { }

  getRegions(): Observable<any> {
    // assemble the request headers
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');

    return this._http
      .get(this._config.location_api.region.endpoint, {
        headers
      })
      .map((res: Response) => res.json())
      ;
  }

  getProvinces(): Observable<any> {
    // assemble the request headers
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');

    return this._http
      .get(this._config.location_api.province.endpoint, {
        headers
      })
      .map((res: Response) => res.json())
      ;
  }

  getProvincesByRegionId(regionId: number): Observable<any> {
    const endpoint = `${this._config.location_api.region.endpoint}${regionId}/provinces`;

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

  getProvincesFromFT(): Observable<any> {
    const endpoint = trimEnd(this._config.location_api.province.endpoint, '/');

    // assemble the request headers
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');

    return this._http
      .get(`${endpoint}/ft`, {
        headers
      })
      .map((res: Response) => res.json())
      ;
  }

}


