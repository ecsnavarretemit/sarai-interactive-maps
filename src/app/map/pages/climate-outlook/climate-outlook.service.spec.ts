/* tslint:disable:no-unused-variable */

/*!
 * Climate Outlook Service Test
 *
 * Copyright(c) Exequiel Ceasar Navarrete <esnavarrete1@up.edu.ph>
 * Licensed under MIT
 */

import { TestBed, async, inject } from '@angular/core/testing';
import { ClimateOutookService } from './climate-outlook.service';

describe('Service: ClimateOutook', () => {

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ClimateOutookService]
    });
  });

  it('should ...', inject([ClimateOutookService], (service: ClimateOutookService) => {
    expect(service).toBeTruthy();
  }));

});


