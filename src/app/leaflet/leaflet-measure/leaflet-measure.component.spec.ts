/* tslint:disable:no-unused-variable */

/*!
 * Leaflet Measure Component Test
 *
 * Copyright(c) Exequiel Ceasar Navarrete <esnavarrete1@up.edu.ph>
 * Licensed under MIT
 */

import { Renderer } from '@angular/core';
import { TestBed, async, inject } from '@angular/core/testing';
import { LeafletMeasureComponent } from './leaflet-measure.component';
import { LeafletMapService } from '../leaflet-map.service';

describe('Component: LeafletMeasure', () => {

  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      LeafletMapService,
      Renderer,
      LeafletMeasureComponent
    ]
  }));

  it('should create an instance', inject([LeafletMeasureComponent], (component: LeafletMeasureComponent) => {
    expect(component).toBeTruthy();
  }));

});


