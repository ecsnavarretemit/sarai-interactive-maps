/* tslint:disable:no-unused-variable */

/*!
 * Leaflet Geocoder Component Test
 *
 * Copyright(c) Exequiel Ceasar Navarrete <esnavarrete1@up.edu.ph>
 * Licensed under MIT
 */

import { TestBed, async, inject } from '@angular/core/testing';
import { LeafletGeocoderComponent } from './leaflet-geocoder.component';
import { LeafletMapService } from '../leaflet-map.service';

describe('Component: LeafletGeocoder', () => {

  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      LeafletMapService,
      LeafletGeocoderComponent
    ]
  }));

  it('should create an instance', inject([LeafletGeocoderComponent], (component: LeafletGeocoderComponent) => {
    expect(component).toBeTruthy();
  }));

});


