/* tslint:disable:no-unused-variable */

/*!
 * Leaflet Map Service
 *
 * Copyright(c) Exequiel Ceasar Navarrete <esnavarrete1@up.edu.ph>
 * Licensed under MIT
 */

import { TestBed, async, inject } from '@angular/core/testing';
import { LeafletMapService } from './leaflet-map.service';

describe('Service: LeafletMap', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LeafletMapService]
    });
  });

  it('should ...', inject([LeafletMapService], (service: LeafletMapService) => {
    expect(service).toBeTruthy();
  }));
});


