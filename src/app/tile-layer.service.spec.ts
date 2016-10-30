/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { TileLayerService } from './tile-layer.service';

describe('Service: TileLayerService', () => {

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TileLayerService]
    });
  });

  it('should ...', inject([TileLayerService], (service: TileLayerService) => {
    expect(service).toBeTruthy();
  }));

});


