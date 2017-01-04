/* tslint:disable:no-unused-variable */

/*!
 * Rainfall Map Panel Component Test
 *
 * Copyright(c) Exequiel Ceasar Navarrete <esnavarrete1@up.edu.ph>
 * Licensed under MIT
 */

import { Renderer } from '@angular/core';
import { TestBed, async, inject } from '@angular/core/testing';
import { LeafletMapService } from '../../leaflet';
import { RainfallMapPanelComponent } from './rainfall-map-panel.component';

describe('Component: RainfallMapPanel', () => {

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        Renderer,
        LeafletMapService,
        RainfallMapPanelComponent
      ]
    });
  });

  it('should create an instance', inject([RainfallMapPanelComponent], (component: RainfallMapPanelComponent) => {
    expect(component).toBeTruthy();
  }));

});


