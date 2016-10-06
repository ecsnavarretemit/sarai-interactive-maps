/* tslint:disable:no-unused-variable */

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


