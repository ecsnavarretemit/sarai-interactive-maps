/*!
 * Locations Service (Mock)
 *
 * Copyright(c) Exequiel Ceasar Navarrete <esnavarrete1@up.edu.ph>
 * Licensed under MIT
 */

import { Observable } from 'rxjs/Observable';
import { LocationsService } from '../../map/shared';
import 'rxjs/add/observable/of';

export class MockLocationsService extends LocationsService {

  constructor() {
    super(null, null);
  }

  getRegions(): Observable<any> {
    return Observable.of({
      result: [
        {
          id: 100,
          name: 'Ilocos Region',
          region_normalized: 'Region 1',
          region_normalized_canonical: 'Ilocos Region (Region 1)',
          region_roman: 'Region I',
          region_roman_canonical: 'Ilocos Region (Region I)',
          slug: 'ilocos-region-region-i'
        }
      ],
      success: true
    });
  }

  getProvinces(): Observable<any> {
    return Observable.of({
      result: [
        {
          id: 100,
          name: 'Ilocos Norte',
          slug: 'ilocos-norte',
        }
      ],
      success: true
    });
  }

  getProvincesByRegionId(regionId: number): Observable<any> {
    return Observable.of({
      result: [
        {
          id: 100,
          name: 'Ilocos Norte',
          slug: 'ilocos-norte',
        }
      ],
      success: true
    });
  }

  getProvincesFromFT(): Observable<any> {
    return Observable.of({
      places: [
        {
          center: {
          coordinates: [
            120.679049423,
            15.023545,
            0.0
          ],
          type: 'Point'
        },
        name: 'Pampanga'
        }
      ],
      success: true
    });
  }

}


