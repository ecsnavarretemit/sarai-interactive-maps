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
    declarations: [
      LeafletMapComponent
    ],
    providers: [
      LeafletMapService,
      LeafletMapComponent
    ]
  }));

  it('should create an instance', inject([LeafletMapComponent], (component: LeafletMapComponent) => {
    expect(component).toBeTruthy();
  }));

  it('should create map', async(inject([LeafletMapService], (service: LeafletMapService) => {
    // assemble the component
    const fixture = TestBed.createComponent(LeafletMapComponent);

    // get the instance of the component
    const component: LeafletMapComponent = fixture.componentInstance;

    // provide the inputs for the component
    component.lat = 13;
    component.lng = 122;
    component.zoom = 6;

    fixture.detectChanges();

    service
      .getMap()
      .then((map: L.Map) => {
        expect(map).toBeTruthy();
      })
      ;
  })));

});


