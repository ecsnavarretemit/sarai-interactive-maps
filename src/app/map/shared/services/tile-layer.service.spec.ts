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
import { AppConfig, APP_CONFIG } from '../../../app.config';
import { MapConfig, MAP_CONFIG } from '../../map.config';
import { environment } from '../../../../environments/environment';
import { TileLayerService } from './tile-layer.service';
import trimEnd from 'lodash-es/trimEnd';

describe('Service: TileLayer', () => {

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        MockBackend,
        BaseRequestOptions,
        TileLayerService,

        { provide: APP_CONFIG, useValue: AppConfig },
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
    const resolvedMapConfig = environment.app.map;
    const resolvedGlobalConfig = environment.app.global;
    const tileLayerUrl = service.getGeoServerWMSTileLayerBaseUrl(
      resolvedMapConfig.suitability_maps.wms.workspace,
      resolvedMapConfig.suitability_maps.wms.tiled
    );

    let expectedUrl = trimEnd(resolvedGlobalConfig.geoserver.baseUrl, '/') + `/${resolvedMapConfig.suitability_maps.wms.workspace}/wms`;

    if (resolvedMapConfig.suitability_maps.wms.tiled === true) {
      expectedUrl += ((expectedUrl.indexOf('?') >= 0) ? '&' : '?') + 'tiled=true';
    }

    expect(tileLayerUrl).toEqual(expectedUrl);
  }));

  it('should equate to the CQL Filter', inject([TileLayerService], (service: TileLayerService) => {
    const gridcodes = [10, 21, 22, 23, 35];
    const property = environment.app.map.suitability_maps.propertyFilterName;

    expect(service.getCQLFilterByGridcode(gridcodes)).toEqual(
      `${property}=10 OR ${property}=21 OR ${property}=22 OR ${property}=23 OR ${property}=35`
    );
  }));

  it('should get NDVI layer data', async(inject([MockBackend, TileLayerService], (backend: MockBackend, service: TileLayerService) => {
    const dataToSend = {
      'mapId': 'a',
      'mapToken': 'b',
      'success': true
    };

    backend.connections.subscribe((connection: MockConnection) => {
      const options = new ResponseOptions({
        body: JSON.stringify(dataToSend)
      });

      connection.mockRespond(new Response(options));

      expect(connection.request.method).toEqual(RequestMethod.Get);
    });

    service
      .getNdviLayerData('2016-10-01', '2016-10-31')
      .then((data) => {
        expect(data.success).toBe(true);
      })
      ;
  })));

  it('should throw an error when getting NDVI layer data',
    async(inject([MockBackend, TileLayerService], (backend: MockBackend, service: TileLayerService) => {
      const dataToSend = {
        'success': false
      };

      backend.connections.subscribe((connection: MockConnection) => {
        const options = new ResponseOptions({
          body: JSON.stringify(dataToSend)
        });

        connection.mockRespond(new Response(options));

        expect(connection.request.method).toEqual(RequestMethod.Get);
      });

      service
        .getNdviLayerData('2016-10-01', '2016-10-31')
        .catch((err: Error) => {
          expect(() => {
            throw err;
          }).toThrowError(Error);
        })
        ;
    })));

  it('should get rainfall layer data', async(inject([MockBackend, TileLayerService], (backend: MockBackend, service: TileLayerService) => {
    const dataToSend = {
      'mapId': 'a',
      'mapToken': 'b',
      'success': true
    };

    backend.connections.subscribe((connection: MockConnection) => {
      const options = new ResponseOptions({
        body: JSON.stringify(dataToSend)
      });

      connection.mockRespond(new Response(options));

      expect(connection.request.method).toEqual(RequestMethod.Get);
    });

    service
      .getRainfallMapLayerData('2016-10-01', '2016-10-31')
      .then((data) => {
        expect(data.success).toBe(true);
      })
      ;
  })));

  it('should throw an error getting rainfall layer data',
    async(inject([MockBackend, TileLayerService], (backend: MockBackend, service: TileLayerService) => {
      const dataToSend = {
        'success': false
      };

      backend.connections.subscribe((connection: MockConnection) => {
        const options = new ResponseOptions({
          body: JSON.stringify(dataToSend)
        });

        connection.mockRespond(new Response(options));

        expect(connection.request.method).toEqual(RequestMethod.Get);
      });

      service
        .getRainfallMapLayerData('2016-10-01', '2016-10-31')
        .catch((err: Error) => {
          expect(() => {
            throw err;
          }).toThrowError(Error);
        })
        ;
    })));

});


