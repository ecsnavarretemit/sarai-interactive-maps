/* tslint:disable:no-unused-variable */

/*!
 * Leaflet WMS Layer Component Test
 *
 * Copyright(c) Exequiel Ceasar Navarrete <esnavarrete1@up.edu.ph>
 * Licensed under MIT
 */

import { TestBed, async, inject } from '@angular/core/testing';
import { LeafletWmsLayerComponent } from './leaflet-wms-layer.component';
import { LeafletMapService } from '../leaflet-map.service';

describe('Component: LeafletWmsLayer', () => {

  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      LeafletMapService,
      LeafletWmsLayerComponent
    ]
  }));

  it('should create an instance', inject([LeafletWmsLayerComponent], (component: LeafletWmsLayerComponent) => {
    expect(component).toBeTruthy();
  }));

});


