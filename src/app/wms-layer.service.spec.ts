/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { WmsLayerService } from './wms-layer.service';

describe('Service: WmsLayerService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [WmsLayerService]
    });
  });

  it('should ...', inject([WmsLayerService], (service: WmsLayerService) => {
    expect(service).toBeTruthy();
  }));
});
