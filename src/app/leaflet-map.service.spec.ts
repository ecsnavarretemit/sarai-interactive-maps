/* tslint:disable:no-unused-variable */

/*!
 * Leaflet Map Service Test
 *
 * Copyright(c) Exequiel Ceasar Navarrete <esnavarrete1@up.edu.ph>
 * Licensed under MIT
 */

import { TestBed, async, inject } from '@angular/core/testing';
import { LeafletMapService } from './leaflet-map.service';
import * as L from 'leaflet';

describe('Service: LeafletMap', () => {
  let el: HTMLElement;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LeafletMapService]
    });

    // create mock element needed for creating map
    el = document.createElement('div');
    document.body.appendChild(el);
  });

  it('should instantiate the service', inject([LeafletMapService], (service: LeafletMapService) => {
    expect(service).toBeTruthy();
  }));

  it('should create map', async(inject([LeafletMapService], (service: LeafletMapService) => {
    service.createMap(el, {});

    service.getMap().then((map: L.Map) => {
      expect(map).toBeTruthy();
    });
  })));

  it('should add base tilelayer', async(inject([LeafletMapService], (service: LeafletMapService) => {
    service
      .addNewTileLayer('test-tile-layer', 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: 'Map data &copy; <a href="http://openstreetmap.org" target="_blank">OpenStreetMap</a> contributors'
      })
      .then((layer: L.TileLayer) => {
        expect(layer).toBeTruthy();
      })
      ;
  })));

   it('should clear all tile layers', async(inject([LeafletMapService], (service: LeafletMapService) => {
    service
      .clearTileLayers()
      .then(() => {
        return service.getTileLayers();
      })
      .then((layers: any) => {
        let keys = Object.keys(layers);

        expect(keys).toEqual(0);
      })
      ;
  })));

  afterEach(inject([LeafletMapService], (service: LeafletMapService) => {
    service.getMap().then((map: L.Map) => {
      // remove the map
      map.remove();

      // remove mock element after execution
      el.remove();
    });
  }));

});


