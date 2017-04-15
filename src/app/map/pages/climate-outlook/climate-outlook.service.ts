/*!
 * Climate Outlook Service
 *
 * Copyright(c) Exequiel Ceasar Navarrete <esnavarrete1@up.edu.ph>
 * Licensed under MIT
 */

import { Injectable } from '@angular/core';
import { Headers, Http, Response } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class ClimateOutookService {

  constructor(private _http: Http) { }

  getRegionalBorders() {
    const endpoint = 'http://localhost:3100/borders/regions';

    // assemble the request headers
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Cache-Control', 'private, maxage=31536000');

    return this._http
      .get(endpoint, {
        headers
      })
      .map((res: Response) => res.json())
      ;
  }

  getProvincialBorders(bbox?: Array<number>) {
    let endpoint = 'http://localhost:3100/borders/provinces';

    if (typeof bbox !== 'undefined') {
      endpoint += `?bbox=${bbox.join(',')}`;
    }

    // assemble the request headers
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Cache-Control', 'private, maxage=31536000');

    return this._http
      .get(endpoint, {
        headers
      })
      .map((res: Response) => res.json())
      ;
  }

}


