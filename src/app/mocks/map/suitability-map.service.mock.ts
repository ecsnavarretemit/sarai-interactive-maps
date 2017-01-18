/*!
 * Suitability Map Service
 *
 * Copyright(c) Exequiel Ceasar Navarrete <esnavarrete1@up.edu.ph>
 * Licensed under MIT
 */

import { Observable } from 'rxjs/Observable';
import { Response, ResponseOptions } from '@angular/http';
import { SuitabilityMapService } from '../../map/suitability-map.service';
import { SuitabilityLevel } from '../../map/suitability-level.interface';
import { Crop } from '../../map/crop.interface';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';

export class MockSuitabilityMapService extends SuitabilityMapService {

  constructor() {
    super(null, null);
  }

  getCrops(): Observable<any> {
    return Observable.of({
      success: true,
      result: [
        {
          crop_type: 'rice',
          id: 100,
          name: 'Rice',
          slug: 'rice'
        }
      ]
    });
  }

  // This function only exists to simulate the old `getCrops()` behavior.
  getCropsOrganizedByType(): Observable<Array<Crop>> {
    return Observable.of([
      {
        name: 'Rice',
        slug: 'rice'
      }
    ]);
  }

  checkIfSuitabilityMapImageExists(crop: string, province: string, extension = 'pdf'): Promise<any> {
    const responseOptions: ResponseOptions = new ResponseOptions({
        url: 'http://localhost:4100',
        body: ''
    });

    return Observable
      .of(new Response(responseOptions))
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
        }
      ];
    });
  }

}


