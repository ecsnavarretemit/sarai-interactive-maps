/* tslint:disable:no-unused-variable */

/*!
 * Leaflet Opacity Slider Component Test
 *
 * Copyright(c) Exequiel Ceasar Navarrete <esnavarrete1@up.edu.ph>
 * Licensed under MIT
 */

import { Renderer } from '@angular/core';
import { TestBed, async, inject } from '@angular/core/testing';
import { provideStore } from '@ngrx/store';
import { LeafletOpacitySliderComponent } from './leaflet-opacity-slider.component';
import { LeafletMapService } from '../leaflet-map.service';
import { MapLayersReducer, SuitabilityLevelsReducer } from '../../store';

describe('Component: LeafletOpacitySlider', () => {

  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      LeafletMapService,
      Renderer,
      LeafletOpacitySliderComponent,
      provideStore({
        mapLayers: MapLayersReducer,
        suitabilityLevels: SuitabilityLevelsReducer
      }),
    ]
  }));

  it('should create an instance', inject([LeafletOpacitySliderComponent], (component: LeafletOpacitySliderComponent) => {
    expect(component).toBeTruthy();
  }));

});


