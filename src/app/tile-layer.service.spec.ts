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

  it('WMS Tile URL should equate to the configuration', inject([TileLayerService], (service: TileLayerService) => {
    expect(service.getUrl()).toEqual(environment.sarai_map_config.geoserver.wmsTileLayerUrl);
  }));

});


