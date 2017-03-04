/* tslint:disable:no-unused-variable */

/*!
 * Rainfall Map Service Test
 *
 * Copyright(c) Exequiel Ceasar Navarrete <esnavarrete1@up.edu.ph>
 * Licensed under MIT
 */

import { TestBed, async, inject } from '@angular/core/testing';
import { Http, BaseRequestOptions, RequestMethod, Response, ResponseOptions } from '@angular/http';
import { MockBackend, MockConnection } from '@angular/http/testing';

import { MapConfig, MAP_CONFIG } from '../../map.config';
import { RainfallMapService } from './rainfall-map.service';

describe('Service: RainfallMap', () => {

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

        RainfallMapService
      ]
    });
  });

  it('should instantiate the service', inject([RainfallMapService], (service: RainfallMapService) => {
    expect(service).toBeTruthy();
  }));

  it('should get cumulative rainfall data',
    async(inject([MockBackend, RainfallMapService], (backend: MockBackend, service: RainfallMapService) => {
      const dataToSend = {
        data: [{
          date: 'Feb 18, 2000',
          value: 8902
        }],
        success: true
      };

      backend.connections.subscribe((connection: MockConnection) => {
        const options = new ResponseOptions({
          body: JSON.stringify(dataToSend)
        });

        connection.mockRespond(new Response(options));

        expect(connection.request.method).toEqual(RequestMethod.Get);
        expect(connection.request.headers.get('Content-Type')).toEqual('application/json');
      });

      service
        .getCumulativeRainfallByLatLng({
          lat: 17.06400534417392,
          lng: 121.67495727539062
        }, '2015-10-31', '2016-10-31')
        .subscribe((data) => {
          expect(data.success).toBe(true);
        })
        ;
    })));

});


