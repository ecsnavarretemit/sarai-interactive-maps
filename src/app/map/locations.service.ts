/*!
 * Locations Service
 *
 * Copyright(c) Exequiel Ceasar Navarrete <esnavarrete1@up.edu.ph>
 * Licensed under MIT
 */

import { Injectable, Inject } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { MAP_CONFIG } from './map.config';
import 'rxjs/add/operator/map';

@Injectable()
export class LocationsService {

  constructor(
    @Inject(MAP_CONFIG) private _config: any,
    private _http: Http
  ) { }

  getRegions(): Observable<any> {
    return this._http
      .get(this._config.location_api.region.endpoint)
      .map((res: Response) => res.json())
      ;
  }

  getProvinces(): Observable<any> {
    return this._http
      .get(this._config.location_api.province.endpoint)
      .map((res: Response) => res.json())
      ;
  }

  getProvincesByRegionId(regionId: number): Observable<any> {
    let endpoint = `${this._config.location_api.province.endpoint}?region_id=${regionId}`;

    return this._http
      .get(endpoint)
      .map((res: Response) => res.json())
      ;
  }

}


