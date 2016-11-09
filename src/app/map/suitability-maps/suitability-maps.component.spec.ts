/* tslint:disable:no-unused-variable */

/*!
 * Suitability Maps Component Test
 *
 * Copyright(c) Exequiel Ceasar Navarrete <esnavarrete1@up.edu.ph>
 * Licensed under MIT
 */

import { TestBed, async, inject } from '@angular/core/testing';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Observable } from 'rxjs';
import { provideStore } from '@ngrx/store';
import { MapConfig, MAP_CONFIG } from '../map.config';
import { AppLoggerService } from '../../app-logger.service';
import { TileLayerService } from '../tile-layer.service';
import { LeafletMapService } from '../../leaflet';
import { MapLayersReducer, SuitabilityLevelsReducer } from '../../store';
import { MockActivatedRoute, MockRouter } from '../../mocks/router';
import { SuitabilityMapsComponent } from './suitability-maps.component';

describe('Component: SuitabilityMaps', () => {
  let mockActivatedRoute: MockActivatedRoute;
  let mockRouter: MockRouter;

  beforeEach(() => {
    mockActivatedRoute = new MockActivatedRoute({
      crop: 'rice'
    });

    mockRouter = new MockRouter();

    TestBed.configureTestingModule({
      providers: [
        TileLayerService,
        LeafletMapService,
        SuitabilityMapsComponent,

        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: Router, useValue: mockRouter },
        { provide: MAP_CONFIG, useValue: MapConfig },

        provideStore({
          mapLayers: MapLayersReducer,
          suitabilityLevels: SuitabilityLevelsReducer
        }),
      ]
    });
  });

  it('should create an instance', inject([SuitabilityMapsComponent], (component: SuitabilityMapsComponent) => {
    expect(component).toBeTruthy();
  }));

});


