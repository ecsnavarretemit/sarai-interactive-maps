/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { AppConfig, APP_CONFIG } from './app.config';
import { environment } from '../environments/environment';
import { TileLayerService } from './tile-layer.service';

describe('Service: TileLayerService', () => {

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        TileLayerService,
        { provide: APP_CONFIG, useValue: AppConfig }
      ]
    });
  });

  it('should instantiate the service', inject([TileLayerService], (service: TileLayerService) => {
    expect(service).toBeTruthy();
  }));

  it('should equate to the WMS Tile URL configuration', inject([TileLayerService], (service: TileLayerService) => {
    expect(service.getUrl()).toEqual(environment.sarai_map_config.geoserver.wmsTileLayerUrl);
  }));

  it('should equate to the CQL Filter', inject([TileLayerService], (service: TileLayerService) => {
    let gridcodes = [10, 21, 22, 23, 35];
    let property = environment.sarai_map_config.suitability_maps.propertyFilterName;

    expect(service.getCQLFilterByGridcode(gridcodes)).toEqual(
      `${property}=10 OR ${property}=21 OR ${property}=22 OR ${property}=23 OR ${property}=35`
    );
  }));

});


