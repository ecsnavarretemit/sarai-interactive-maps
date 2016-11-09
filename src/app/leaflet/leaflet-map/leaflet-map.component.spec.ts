/* tslint:disable:no-unused-variable */

/*!
 * Leaflet Map Component Test
 *
 * Copyright(c) Exequiel Ceasar Navarrete <esnavarrete1@up.edu.ph>
 * Licensed under MIT
 */

import { TestBed, async, inject } from '@angular/core/testing';
import { LeafletMapComponent } from './leaflet-map.component';
import { LeafletMapService } from '../leaflet-map.service';

describe('Component: LeafletMap', () => {

  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      LeafletMapService,
      LeafletMapComponent
    ]
  }));

  it('should create an instance', inject([LeafletMapComponent], (component: LeafletMapComponent) => {
    expect(component).toBeTruthy();
  }));

});


