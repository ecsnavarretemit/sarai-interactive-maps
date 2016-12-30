/* tslint:disable:no-unused-variable */

/*!
 * Suitability Map Service Test
 *
 * Copyright(c) Exequiel Ceasar Navarrete <esnavarrete1@up.edu.ph>
 * Licensed under MIT
 */

import { TestBed, async, inject } from '@angular/core/testing';
import { Http, BaseRequestOptions, RequestMethod, Response, ResponseOptions } from '@angular/http';
import { MockBackend, MockConnection } from '@angular/http/testing';
import { MapConfig, MAP_CONFIG } from './map.config';
import { Crop } from './crop.interface';
import { SuitabilityMapService } from './suitability-map.service';

describe('Service: SuitabilityMap', () => {

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

        SuitabilityMapService
      ]
    });
  });

  it('should instantiate the service', inject([SuitabilityMapService], (service: SuitabilityMapService) => {
    expect(service).toBeTruthy();
  }));

  it('should get crops', async(inject([MockBackend, SuitabilityMapService], (backend: MockBackend, service: SuitabilityMapService) => {
    let dataToSend = {
      result: [{
          crop_type: 'rice',
          id: 100,
          name: 'Rice',
          slug: 'rice'
        }],
      success: true
    };

    backend.connections.subscribe((connection: MockConnection) => {
      let options = new ResponseOptions({
        body: JSON.stringify(dataToSend)
      });

      connection.mockRespond(new Response(options));

      expect(connection.request.method).toEqual(RequestMethod.Get);
      expect(connection.request.headers.get('Content-Type')).toEqual('application/json');
    });

    service
      .getCrops()
      .subscribe((data) => {
        expect(data.success).toBe(true);
      })
      ;
  })));

  it('should get crops according to the old spec',
    async(inject([MockBackend, SuitabilityMapService], (backend: MockBackend, service: SuitabilityMapService) => {
      let dataToSend = {
        result: [
          {
            crop_type: 'rice',
            id: 100,
            name: 'Rice',
            slug: 'rice'
          }, {
            crop_type: 'corn',
            id: 2,
            name: 'Corn Dry',
            slug: 'corn-dry'
          }, {
            crop_type: 'corn',
            id: 3,
            name: 'Corn Wet',
            slug: 'corn-wet'
          }
        ],
        success: true
      };

      backend.connections.subscribe((connection: MockConnection) => {
        let options = new ResponseOptions({
          body: JSON.stringify(dataToSend)
        });

        connection.mockRespond(new Response(options));

        expect(connection.request.method).toEqual(RequestMethod.Get);
        expect(connection.request.headers.get('Content-Type')).toEqual('application/json');
      });

      service
        .getCropsOrganizedByType()
        .subscribe((crops: Array<Crop>) => {
          crops.forEach((value: Crop) => {
            if (typeof value.subcrops !== 'undefined') {
              expect(value.subcrops.length).toBeGreaterThanOrEqual(1);
            } else {
              expect(value.slug).toBe('rice');
            }
          });
        })
        ;
    })));

});


