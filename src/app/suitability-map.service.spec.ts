/* tslint:disable:no-unused-variable */

/*!
 * Suitability Map Service Test
 *
 * Copyright(c) Exequiel Ceasar Navarrete <esnavarrete1@up.edu.ph>
 * Licensed under MIT
 */

import { TestBed, async, inject } from '@angular/core/testing';
import { SuitabilityMapService } from './suitability-map.service';

describe('Service: SuitabilityMap', () => {

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SuitabilityMapService]
    });
  });

  it('should instantiate the service', inject([SuitabilityMapService], (service: SuitabilityMapService) => {
    expect(service).toBeTruthy();
  }));

});


