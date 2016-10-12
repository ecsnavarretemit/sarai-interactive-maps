/* tslint:disable:no-unused-variable */

/*!
 * Suitability Maps Component Test
 *
 * Copyright(c) Exequiel Ceasar Navarrete <esnavarrete1@up.edu.ph>
 * Licensed under MIT
 */

import { TestBed, async, inject } from '@angular/core/testing';
import { Router, ActivatedRoute, } from '@angular/router';
import { SuitabilityMapsComponent } from './suitability-maps.component';
import { WmsLayerService } from '../wms-layer.service';

describe('Component: SuitabilityMaps', () => {

  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      Router,
      ActivatedRoute,
      WmsLayerService,
      SuitabilityMapsComponent
    ]
  }));

  it('should create an instance', inject([SuitabilityMapsComponent], (component: SuitabilityMapsComponent) => {
    expect(component).toBeTruthy();
  }));

});


