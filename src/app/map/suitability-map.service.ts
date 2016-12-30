/*!
 * Suitability Map Service
 *
 * Copyright(c) Exequiel Ceasar Navarrete <esnavarrete1@up.edu.ph>
 * Licensed under MIT
 */

import { Inject, Injectable } from '@angular/core';
import { Headers, Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { MAP_CONFIG } from './map.config';
import { SuitabilityLevel } from './suitability-level.interface';
import { Crop } from './crop.interface';
import { map, reduce, values } from 'lodash';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class SuitabilityMapService {

  constructor(
    @Inject(MAP_CONFIG) private _config: any,
    private _http: Http
  ) { }

  getCrops(): Observable<any> {
    // assemble the request headers
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');

    return this._http
      .get(this._config.suitability_maps.cropsApiEndpoint, {
        headers
      })
      .map((res: Response) => res.json())
      ;
  }

  // This function only exists to simulate the old `getCrops()` behavior.
  getCropsOrganizedByType(): Observable<Array<Crop>> {
    return this.getCrops()
      .map((response: any) => {
        // reduce the data to the format we need
        let transformedData = reduce(response.result, (collection: any, crop: any) => {
          let type = crop.crop_type;
          let title = map(type.split('-'), (word: string) => {
            return word.charAt(0).toUpperCase() + word.substring(1).toLowerCase();
          }).join(' ');

          // create the key for the value of type it it doesn't exist and store the value
          if (typeof collection[type] === 'undefined') {
            collection[type] = {
              name: title,
              slug: type
            };
          }

          // if the slug doesnt match with the crop type, then the crop category has crops under it,
          // so we create subcrops to store the crops under the crop category
          if (type !== crop.slug) {
            if (typeof collection[type].subcrops === 'undefined') {
              collection[type].subcrops = [];
            }

            collection[type].subcrops.push({
              name: crop.name,
              slug: crop.slug
            });
          }

          return collection;
        }, {});

        // we only need the values of the object so we return an array of the values
        return values(transformedData);
      })
      ;
  }

  checkIfSuitabilityMapImageExists(crop: string, province: string, extension = 'pdf'): Promise<any> {
    return this._http
      .head(`${this._config.suitability_maps.imageRootPath}/${crop}/${province}.${extension}`)
      .toPromise();
  }

  getSuitabilityLevels(): Promise<Array<SuitabilityLevel>> {
    return Promise.resolve().then(() => {
      return [
        {
          gridcode: 10,
          category: 'S1',
          name: 'Highly Suitable',
          slug: 'highly-suitable'
        }, {
          gridcode: 21,
          category: 'S2 E',
          name: 'Moderately Suitable with limitation in elevation',
          slug: 'moderately-suitable-with-limitation-in-elevation'
        }, {
          gridcode: 22,
          category: 'S2 T',
          name: 'Moderately Suitable with limitation in slope',
          slug: 'moderately-suitable-with-limitation-in-slope'
        }, {
          gridcode: 23,
          category: 'S2 S',
          name: 'Moderately Suitable with limitation in soil',
          slug: 'moderately-suitable-with-limitation-in-soil'
        }, {
          gridcode: 24,
          category: 'S2 ET',
          name: 'Moderately Suitable with limitation in elevation and slope',
          slug: 'moderately-suitable-with-limitation-in-elevation-and-slope'
        }, {
          gridcode: 25,
          category: 'S2 TS',
          name: 'Moderately Suitable with limitation in slope and soil',
          slug: 'moderately-suitable-with-limitation-in-slope-and-soil'
        }, {
          gridcode: 26,
          category: 'S2 ES',
          name: 'Moderately Suitable with limitation in elevation and soil',
          slug: 'moderately-suitable-with-limitation-in-elevation-and-soil'
        }, {
          gridcode: 27,
          category: 'S2 ETS',
          name: 'Moderately Suitable with limitation in elevation, slope and soil',
          slug: 'moderately-suitable-with-limitation-in-elevation-slope-and-soil'
        }, {
          gridcode: 31,
          category: 'S2 E',
          name: 'Marginally Suitable with limitation in elevation',
          slug: 'marginally-suitable-with-limitation-in-elevation'
        }, {
          gridcode: 32,
          category: 'S2 T',
          name: 'Marginally Suitable with limitation in slope',
          slug: 'marginally-suitable-with-limitation-in-slope'
        }, {
          gridcode: 33,
          category: 'S2 S',
          name: 'Marginally Suitable with limitation in soil',
          slug: 'marginally-suitable-with-limitation-in-soil'
        }, {
          gridcode: 34,
          category: 'S2 ET',
          name: 'Marginally Suitable with limitation in elevation and slope',
          slug: 'marginally-suitable-with-limitation-in-elevation-and-slope'
        }, {
          gridcode: 35,
          category: 'S2 TS',
          name: 'Marginally Suitable with limitation in slope and soil',
          slug: 'marginally-suitable-with-limitation-in-slope-and-soil'
        }, {
          gridcode: 36,
          category: 'S2 ES',
          name: 'Marginally Suitable with limitation in elevation and soil',
          slug: 'marginally-suitable-with-limitation-in-elevation-and-soil'
        }, {
          gridcode: 37,
          category: 'S2 ETS',
          name: 'Marginally Suitable with limitation in elevation, slope and soil',
          slug: 'marginally-suitable-with-limitation-in-elevation-slope-and-soil'
        }
      ];
    });
  }

}


