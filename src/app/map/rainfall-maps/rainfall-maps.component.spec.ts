/* tslint:disable:no-unused-variable */

/*!
 * Rainfall Maps Component Test
 *
 * Copyright(c) Exequiel Ceasar Navarrete <esnavarrete1@up.edu.ph>
 * Licensed under MIT
 */

import { TestBed, async, inject } from '@angular/core/testing';
import { ActivatedRoute, Params } from '@angular/router';
import { HttpModule } from '@angular/http';
import { Title } from '@angular/platform-browser';
import { Observable } from 'rxjs/Observable';
import { provideStore } from '@ngrx/store';
import { MapConfig, MAP_CONFIG } from '../map.config';
import { AppLoggerService } from '../../app-logger.service';
import { TileLayerService } from '../tile-layer.service';
import { LeafletMapService } from '../../leaflet';
import { MapLayersReducer, SuitabilityLevelsReducer } from '../../store';
import { MockActivatedRoute, MockRouter } from '../../mocks/router';
import { RainfallMapsComponent } from './rainfall-maps.component';

describe('Component: RainfallMaps', () => {
  let mockActivatedRoute: MockActivatedRoute;

  beforeEach(() => {
    mockActivatedRoute = new MockActivatedRoute({
      date: '2016-10-01'
    });

    TestBed.configureTestingModule({
      imports: [
        HttpModule
      ],

      providers: [
        AppLoggerService,
        TileLayerService,
        LeafletMapService,
        Title,
        RainfallMapsComponent,

        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: MAP_CONFIG, useValue: MapConfig },

        provideStore({
          mapLayers: MapLayersReducer,
          suitabilityLevels: SuitabilityLevelsReducer
        }),
      ],
    });
  });

  it('should create an instance', inject([RainfallMapsComponent], (component: RainfallMapsComponent) => {
    expect(component).toBeTruthy();
  }));

});


