/* tslint:disable:no-unused-variable */

/*!
 * Crop Production Area Maps Component Test
 *
 * Copyright(c) Exequiel Ceasar Navarrete <esnavarrete1@up.edu.ph>
 * Licensed under MIT
 */

import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { HttpModule } from '@angular/http';
import { ActivatedRoute, Params } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { provideStore } from '@ngrx/store';
import { MapConfig, MAP_CONFIG } from '../map.config';
import { TileLayerService } from '../shared';
import { LeafletMapService, LeafletModule } from '../../leaflet';
import { MapLayersReducer, SuitabilityLevelsReducer } from '../../store';
import { MockActivatedRoute, MockRouter } from '../../mocks/router';

import { CropProductionAreaMapsComponent } from './crop-production-area-maps.component';

describe('Component: CropProductionAreaMaps', () => {
  let component: CropProductionAreaMapsComponent;
  let fixture: ComponentFixture<CropProductionAreaMapsComponent>;
  let mockActivatedRoute: MockActivatedRoute;

  beforeEach(async(() => {
    mockActivatedRoute = new MockActivatedRoute({
      crop: 'rice'
    });

    TestBed.configureTestingModule({
      declarations: [
        CropProductionAreaMapsComponent
      ],
      imports: [
        HttpModule,
        LeafletModule
      ],
      providers: [
        TileLayerService,
        LeafletMapService,
        Title,

        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: MAP_CONFIG, useValue: MapConfig },

        provideStore({
          mapLayers: MapLayersReducer,
          suitabilityLevels: SuitabilityLevelsReducer
        }),
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CropProductionAreaMapsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create an instance', () => {
    expect(component).toBeTruthy();
  });

});


