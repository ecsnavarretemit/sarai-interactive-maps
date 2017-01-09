/* tslint:disable:no-unused-variable */

/*!
 * Tile Layer Service Test
 *
 * Copyright(c) Exequiel Ceasar Navarrete <esnavarrete1@up.edu.ph>
 * Licensed under MIT
 */

import { TestBed, async, inject } from '@angular/core/testing';
import { Http, BaseRequestOptions, RequestMethod, Response, ResponseOptions } from '@angular/http';
import { MockBackend, MockConnection } from '@angular/http/testing';
import { MapConfig, MAP_CONFIG } from './map.config';
import { environment } from '../../environments/environment';
import { TileLayerService } from './tile-layer.service';
import trimEnd from 'lodash-es/trimEnd';

describe('Service: TileLayerService', () => {

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        MockBackend,
        BaseRequestOptions,
        TileLayerService,

        { provide: MAP_CONFIG, useValue: MapConfig },
        {
          provide: Http,
          deps: [MockBackend, BaseRequestOptions],
          useFactory: (backendInstance: MockBackend, defaultOptions: BaseRequestOptions) => {
            return new Http(backendInstance, defaultOptions);
          }
        },
      ]
    });
  });

  it('should instantiate the service', inject([TileLayerService], (service: TileLayerService) => {
    expect(service).toBeTruthy();
  }));

  it('should generate a valid WMS Tile URL', inject([TileLayerService], (service: TileLayerService) => {
    let resolvedConfig = environment.sarai_map_config;
    let tileLayerUrl = service.getGeoServerWMSTileLayerBaseUrl(
      resolvedConfig.suitability_maps.wms.workspace,
      resolvedConfig.suitability_maps.wms.tiled
    );

    let expectedUrl = trimEnd(resolvedConfig.geoserver.baseUrl, '/') + `/${resolvedConfig.suitability_maps.wms.workspace}/wms`;

    if (resolvedConfig.suitability_maps.wms.tiled === true) {
      expectedUrl += ((expectedUrl.indexOf('?') >= 0) ? '&' : '?') + 'tiled=true';
    }

    expect(tileLayerUrl).toEqual(expectedUrl);
  }));

  it('should equate to the CQL Filter', inject([TileLayerService], (service: TileLayerService) => {
    let gridcodes = [10, 21, 22, 23, 35];
    let property = environment.sarai_map_config.suitability_maps.propertyFilterName;

    expect(service.getCQLFilterByGridcode(gridcodes)).toEqual(
      `${property}=10 OR ${property}=21 OR ${property}=22 OR ${property}=23 OR ${property}=35`
    );
  }));

  it('should get NDVI layer data', async(inject([MockBackend, TileLayerService], (backend: MockBackend, service: TileLayerService) => {
    let dataToSend = {
      'mapId': 'a',
      'mapToken': 'b',
      'success': true
    };

    backend.connections.subscribe((connection: MockConnection) => {
      let options = new ResponseOptions({
        body: JSON.stringify(dataToSend)
      });

      connection.mockRespond(new Response(options));

      expect(connection.request.method).toEqual(RequestMethod.Get);
    });

    service
      .getNdviLayerData('2016-10-01', 10)
      .then((data) => {
        expect(data.success).toBe(true);
      })
      ;
  })));

  it('should throw an error when getting NDVI layer data',
    async(inject([MockBackend, TileLayerService], (backend: MockBackend, service: TileLayerService) => {
      let dataToSend = {
        'success': false
      };

      backend.connections.subscribe((connection: MockConnection) => {
        let options = new ResponseOptions({
          body: JSON.stringify(dataToSend)
        });

        connection.mockRespond(new Response(options));

        expect(connection.request.method).toEqual(RequestMethod.Get);
      });

      service
        .getNdviLayerData('2016-10-01', 10)
        .catch((err: Error) => {
          expect(() => {
            throw err;
          }).toThrowError(Error);
        })
        ;
    })));

  it('should get rainfall layer data', async(inject([MockBackend, TileLayerService], (backend: MockBackend, service: TileLayerService) => {
    let dataToSend = {
      'mapId': 'a',
      'mapToken': 'b',
      'success': true
    };

    backend.connections.subscribe((connection: MockConnection) => {
      let options = new ResponseOptions({
        body: JSON.stringify(dataToSend)
      });

      connection.mockRespond(new Response(options));

      expect(connection.request.method).toEqual(RequestMethod.Get);
    });

    service
      .getRainfallMapLayerData('2016-10-01')
      .then((data) => {
        expect(data.success).toBe(true);
      })
      ;
  })));

  it('should throw an error getting rainfall layer data',
    async(inject([MockBackend, TileLayerService], (backend: MockBackend, service: TileLayerService) => {
      let dataToSend = {
        'success': false
      };

      backend.connections.subscribe((connection: MockConnection) => {
        let options = new ResponseOptions({
          body: JSON.stringify(dataToSend)
        });

        connection.mockRespond(new Response(options));

        expect(connection.request.method).toEqual(RequestMethod.Get);
      });

      service
        .getRainfallMapLayerData('2016-10-01')
        .catch((err: Error) => {
          expect(() => {
            throw err;
          }).toThrowError(Error);
        })
        ;
    })));


});


