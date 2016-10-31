/* tslint:disable:no-unused-variable */

/*!
 * Leaflet Zoom Component Test
 *
 * Copyright(c) Exequiel Ceasar Navarrete <esnavarrete1@up.edu.ph>
 * Licensed under MIT
 */

import { Renderer } from '@angular/core';
import { TestBed, async, inject } from '@angular/core/testing';
import { LeafletZoomComponent } from './leaflet-zoom.component';
import { LeafletMapService } from '../leaflet-map.service';

describe('Component: LeafletZoom', () => {

  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      LeafletMapService,
      Renderer,
      LeafletZoomComponent
    ]
  }));

  it('should create an instance', inject([LeafletZoomComponent], (component: LeafletZoomComponent) => {
    expect(component).toBeTruthy();
  }));

});


