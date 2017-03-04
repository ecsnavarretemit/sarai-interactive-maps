/* tslint:disable:no-unused-variable */

/*!
 * NDVI Maps Component Test
 *
 * Copyright(c) Exequiel Ceasar Navarrete <esnavarrete1@up.edu.ph>
 * Licensed under MIT
 */

import { TestBed, async, inject } from '@angular/core/testing';
import { Renderer } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpModule } from '@angular/http';
import { Title } from '@angular/platform-browser';
import { Observable } from 'rxjs/Observable';
import { provideStore } from '@ngrx/store';
import { MapConfig, MAP_CONFIG } from '../../../map.config';
import { LoggerService } from '../../../../shared';
import { TileLayerService } from '../../../shared';
import { NdviMapService } from '../ndvi-map.service';
import { LeafletMapService } from '../../../../leaflet';
import { MapLayersReducer, SuitabilityLevelsReducer } from '../../../../store';
import { SpawnModalService } from '../../../../ui';
import { MockActivatedRoute, MockRouter } from '../../../../mocks/router';
import { NdviMapsComponent } from './ndvi-maps.component';

describe('Component: NdviMaps', () => {
  let mockActivatedRoute: MockActivatedRoute;

  beforeEach(() => {
    mockActivatedRoute = new MockActivatedRoute({
      startDate: '2016-10-01',
      endDate: '2016-10-31'
    });

    TestBed.configureTestingModule({
      imports: [
        HttpModule
      ],

      providers: [
        LoggerService,
        TileLayerService,
        NdviMapService,
        LeafletMapService,
        SpawnModalService,
        Renderer,
        Title,
        NdviMapsComponent,

        { provide: ActivatedRoute, useValue: mockActivatedRoute },
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


