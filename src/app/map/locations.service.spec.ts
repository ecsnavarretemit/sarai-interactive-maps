/* tslint:disable:no-unused-variable */

/*!
 * Locations Service Test
 *
 * Copyright(c) Exequiel Ceasar Navarrete <esnavarrete1@up.edu.ph>
 * Licensed under MIT
 */

import { TestBed, async, inject } from '@angular/core/testing';
import { Http, BaseRequestOptions, RequestMethod, Response, ResponseOptions } from '@angular/http';
import { MockBackend, MockConnection } from '@angular/http/testing';
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

  it('should get regions', async(inject([MockBackend, LocationsService], (backend: MockBackend, service: LocationsService) => {
    const dataToSend = {
      'result': [{
        'id': 100,
        'name': 'Ilocos Region',
        'region_normalized': 'Region 1',
        'region_normalized_canonical': 'Ilocos Region (Region 1)',
        'region_roman': 'Region I',
        'region_roman_canonical': 'Ilocos Region (Region I)',
        'slug': 'ilocos-region-region-i'
      }],
      'success': true
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
      .getRegions()
      .subscribe((data) => {
        expect(data.success).toBe(true);
      })
      ;
  })));

  it('should get provinces', async(inject([MockBackend, LocationsService], (backend: MockBackend, service: LocationsService) => {
    const dataToSend = {
      'result': [{
        'id': 100,
        'name': 'Ilocos Norte',
        'slug': 'ilocos-norte',
      }],
      'success': true
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
      .getProvinces()
      .subscribe((data) => {
        expect(data.success).toBe(true);
      })
      ;
  })));

  it('should get provinces by region id', async(inject([MockBackend, LocationsService],
    (backend: MockBackend, service: LocationsService) => {
      const dataToSend = {
        'result': [{
          'id': 100,
          'name': 'Ilocos Norte',
          'slug': 'ilocos-norte'
        }],
        'success': true
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
        .getProvincesByRegionId(1)
        .subscribe((data) => {
          expect(data.success).toBe(true);
        })
        ;
    })));

});


