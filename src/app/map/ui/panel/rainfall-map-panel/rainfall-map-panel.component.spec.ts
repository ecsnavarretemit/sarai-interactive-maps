/* tslint:disable:no-unused-variable */

/*!
 * Rainfall Map Panel Component Test
 *
 * Copyright(c) Exequiel Ceasar Navarrete <esnavarrete1@up.edu.ph>
 * Licensed under MIT
 */

import { Renderer } from '@angular/core';
import { TestBed, async, inject } from '@angular/core/testing';
import { Router } from '@angular/router';
import { provideStore } from '@ngrx/store';
import { LeafletMapService } from '../../../../leaflet';
import { MockRouter } from '../../../../mocks/router';
import { PanelsReducer } from '../../../../store';
import { RainfallMapPanelComponent } from './rainfall-map-panel.component';

describe('Component: RainfallMapPanel', () => {
  const mockRouter = new MockRouter();

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        Renderer,
        LeafletMapService,
        RainfallMapPanelComponent,

        { provide: Router, useValue: mockRouter },
        provideStore({
          panels: PanelsReducer
        })
      ]
    });
  });

  it('should create an instance', inject([RainfallMapPanelComponent], (component: RainfallMapPanelComponent) => {
    expect(component).toBeTruthy();
  }));

});


