/* tslint:disable:no-unused-variable */

/*!
 * Leaflet Opacity Slider Component Test
 *
 * Copyright(c) Exequiel Ceasar Navarrete <esnavarrete1@up.edu.ph>
 * Licensed under MIT
 */

import { TestBed, async, inject } from '@angular/core/testing';
import { LeafletOpacitySliderComponent } from './leaflet-opacity-slider.component';
import { LeafletMapService } from '../leaflet-map.service';

describe('Component: LeafletOpacitySlider', () => {

  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      LeafletMapService,
      LeafletOpacitySliderComponent
    ]
  }));

  it('should create an instance', inject([LeafletOpacitySliderComponent], (component: LeafletOpacitySliderComponent) => {
    expect(component).toBeTruthy();
  }));

});


