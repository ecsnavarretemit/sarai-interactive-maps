/*!
 * Suitability Map Service
 *
 * Copyright(c) Exequiel Ceasar Navarrete <esnavarrete1@up.edu.ph>
 * Licensed under MIT
 */

import { Injectable } from '@angular/core';
import { SuitabilityLevel } from './suitability-level.interface';

export interface Crop {
  name: string;
  slug: string;
  subcrops?: Array<Crop>;
}

@Injectable()
export class SuitabilityMapService {

  constructor() { }

  getCrops(): Promise<Array<Crop>> {
    return Promise.resolve().then(() => {
      return [
        {
          name: 'Rice',
          slug: 'rice'
        }, {
          name: 'Corn',
          slug: 'corn',
          subcrops: [
            {name: 'Corn Dry', slug: 'corn-dry'},
            {name: 'Corn Wet', slug: 'corn-wet'}
          ]
        }, {
          name: 'Banana',
          slug: 'banana'
        }, {
          name: 'Coconut',
          slug: 'coconut'
        }, {
          name: 'Coffee',
          slug: 'coffee',
          subcrops: [
            {name: 'Coffee Arabica', slug: 'coffee-arabica'},
            {name: 'Coffee Robusta', slug: 'coffee-robusta'}
          ]
        }, {
          name: 'Cacao',
          slug: 'cacao'
        }
      ];
    });
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


