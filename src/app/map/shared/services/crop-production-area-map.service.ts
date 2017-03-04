/*!
 * Crop Production Area Map Service
 *
 * Copyright(c) Exequiel Ceasar Navarrete <esnavarrete1@up.edu.ph>
 * Licensed under MIT
 */

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';

@Injectable()
export class CropProductionAreaMapService {

  constructor() { }

  getCrops(): Observable<Array<any>> {
    return Observable.of([
      {
        name: 'Rice',
        slug: 'rice'
      }, {
        name: 'Corn',
        slug: 'corn'
      }
    ]);
  }

}


