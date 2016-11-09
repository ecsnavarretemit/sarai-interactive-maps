/* tslint:disable:no-unused-variable */

/*!
 * NDVI Maps Component Test
 *
 * Copyright(c) Exequiel Ceasar Navarrete <esnavarrete1@up.edu.ph>
 * Licensed under MIT
 */

import { TestBed, async, inject } from '@angular/core/testing';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { HttpModule } from '@angular/http';
import { provideStore } from '@ngrx/store';
import { MapConfig, MAP_CONFIG } from '../map.config';
import { AppLoggerService } from '../../app-logger.service';
import { TileLayerService } from '../tile-layer.service';
import { LeafletMapService } from '../../leaflet';
import { MapLayersReducer, SuitabilityLevelsReducer } from '../../store';
import { MockActivatedRoute, MockRouter } from '../../mocks/router';
import { NdviMapsComponent } from './ndvi-maps.component';

describe('Component: NdviMaps', () => {
  let mockActivatedRoute: MockActivatedRoute;
  let mockRouter: MockRouter;

  beforeEach(() => {
    mockActivatedRoute = new MockActivatedRoute({
      startDate: '2016-10-01',
      scanRange: '10'
    });

    mockRouter = new MockRouter();

    TestBed.configureTestingModule({
      imports: [
        HttpModule
      ],

      providers: [
        AppLoggerService,
        TileLayerService,
        LeafletMapService,
        NdviMapsComponent,

        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: Router, useValue: mockRouter },
        { provide: MAP_CONFIG, useValue: MapConfig },

        provideStore({
          mapLayers: MapLayersReducer,
          suitabilityLevels: SuitabilityLevelsReducer
        }),
      ],
    });
  });

  it('should create an instance', inject([NdviMapsComponent], (component: NdviMapsComponent) => {
    expect(component).toBeTruthy();
  }));

});


