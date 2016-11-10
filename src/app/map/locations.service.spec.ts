/* tslint:disable:no-unused-variable */

/*!
 * Locations Service Test
 *
 * Copyright(c) Exequiel Ceasar Navarrete <esnavarrete1@up.edu.ph>
 * Licensed under MIT
 */

import { TestBed, async, inject } from '@angular/core/testing';
import { Http, BaseRequestOptions } from '@angular/http';
import { MockBackend } from '@angular/http/testing';
import { MapConfig, MAP_CONFIG } from './map.config';
import { LocationsService } from './locations.service';

describe('Service: Locations', () => {

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        MockBackend,
        BaseRequestOptions,

        { provide: MAP_CONFIG, useValue: MapConfig },
        {
          provide: Http,
          deps: [MockBackend, BaseRequestOptions],
          useFactory: (backendInstance: MockBackend, defaultOptions: BaseRequestOptions) => {
            return new Http(backendInstance, defaultOptions);
          }
        },

        LocationsService
      ]
    });
  });

  it('should create instance', inject([LocationsService], (service: LocationsService) => {
    expect(service).toBeTruthy();
  }));

});


