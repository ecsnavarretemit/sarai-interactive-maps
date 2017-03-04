/* tslint:disable:no-unused-variable */

/*!
 * Crop Production Area Map Service Test
 *
 * Copyright(c) Exequiel Ceasar Navarrete <esnavarrete1@up.edu.ph>
 * Licensed under MIT
 */

import { TestBed, async, inject } from '@angular/core/testing';
import { CropProductionAreaMapService } from './crop-production-area-map.service';

describe('Service: CropProductionAreaMap', () => {

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        CropProductionAreaMapService
      ]
    });
  });

  it('should instantiate the service', inject([CropProductionAreaMapService], (service: CropProductionAreaMapService) => {
    expect(service).toBeTruthy();
  }));

  it('should return 1 or more crops', async(inject([CropProductionAreaMapService], (service: CropProductionAreaMapService) => {
    service.getCrops().subscribe((crops: Array<any>) => {
      expect(crops.length).toBeGreaterThanOrEqual(1);
    });
  })));

});


