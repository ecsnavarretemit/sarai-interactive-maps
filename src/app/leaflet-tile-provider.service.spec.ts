/* tslint:disable:no-unused-variable */

/*!
 * Leaflet Tile Provider Service Test
 *
 * Copyright(c) Exequiel Ceasar Navarrete <esnavarrete1@up.edu.ph>
 * Licensed under MIT
 */

import { TestBed, async, inject } from '@angular/core/testing';
import { LeafletTileProviderService } from './leaflet-tile-provider.service';

describe('Service: LeafletTileProvider', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LeafletTileProviderService]
    });
  });

  it('should ...', inject([LeafletTileProviderService], (service: LeafletTileProviderService) => {
    expect(service).toBeTruthy();
  }));
});


