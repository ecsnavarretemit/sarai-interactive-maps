/* tslint:disable:no-unused-variable */

/*!
 * Suitability Maps Filter Component Test
 *
 * Copyright(c) Exequiel Ceasar Navarrete <esnavarrete1@up.edu.ph>
 * Licensed under MIT
 */

import { Renderer } from '@angular/core';
import { TestBed, async, inject } from '@angular/core/testing';
import { HttpModule } from '@angular/http';
import { provideStore } from '@ngrx/store';
import { SuitabilityMapService } from '../../../shared';
import { LeafletMapService } from '../../../../leaflet';
import { MapConfig, MAP_CONFIG } from '../../../map.config';
import { MapLayersReducer, SuitabilityLevelsReducer } from '../../../../store';
import { SuitabilityMapsFilterComponent } from './suitability-maps-filter.component';

describe('Component: SuitabilityMapsFilter', () => {

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpModule
      ],
      providers: [
        LeafletMapService,
        Renderer,
        SuitabilityMapService,
        SuitabilityMapsFilterComponent,

        { provide: MAP_CONFIG, useValue: MapConfig },
        provideStore({
          mapLayers: MapLayersReducer,
          suitabilityLevels: SuitabilityLevelsReducer
        }),
      ]
    });
  });

  it('should create an instance', inject([SuitabilityMapsFilterComponent], (component: SuitabilityMapsFilterComponent) => {
    expect(component).toBeTruthy();
  }));

});


