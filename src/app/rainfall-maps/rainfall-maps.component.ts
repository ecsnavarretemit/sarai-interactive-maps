/*!
 * Rainfall Maps Component
 *
 * Copyright(c) Exequiel Ceasar Navarrete <esnavarrete1@up.edu.ph>
 * Licensed under MIT
 */

import { Component, Inject, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Http, Response } from '@angular/http';
import { APP_CONFIG } from '../app.config';
import { Store } from '@ngrx/store';
import { LeafletMapService } from '../leaflet-map.service';
import { TileLayerService } from '../tile-layer.service';
import { AppLoggerService } from '../app-logger.service';
import { Layer } from '../store';

@Component({
  selector: 'app-rainfall-maps',
  templateUrl: './rainfall-maps.component.html',
  styleUrls: ['./rainfall-maps.component.sass']
})
export class RainfallMapsComponent implements OnInit, OnDestroy {
  private _layerId: string;

  constructor(
    @Inject(APP_CONFIG) private _config: any,
    private _mapService: LeafletMapService,
    private _tileLayerService: TileLayerService,
    private _logger: AppLoggerService,
    private _http: Http,
    private _route: ActivatedRoute,
    private _router: Router,
    private _mapLayersStore: Store<any>
  ) { }

  ngOnInit() {
    // listen for changes in crop url parameter since `route.params` is an instance of Observable!
    this._route.params.forEach((params: Params) => {
      // check if startDate and scanRange is valid
      if (
        typeof params['date'] !== 'undefined' &&
        /^\d{4}[\/\-](0?[1-9]|1[012])[\/\-](0?[1-9]|[12][0-9]|3[01])/g.test(params['date'])
      ) {
        this.processData(params['date']);
      }
    });
  }

  processData(date: string) {
    // remove all layers published on the store
    this._mapLayersStore.dispatch({
      type: 'REMOVE_ALL_LAYERS'
    });

    // throw error if endpoint does not exist
    if (typeof this._config.rainfall_maps.eeApiEndpoint === 'undefined' || this._config.rainfall_maps.eeApiEndpoint === '') {
      throw new Error('API Endpoint for NDVI Layers not specified');
    }

    let endpoint = this._config.rainfall_maps.eeApiEndpoint;
    let method = 'post';
    let args = [endpoint, {
      date
    }];

    if (this._config.rainfall_maps.eeApiEndpointMethod.toLowerCase() === 'get') {
      method = 'get';
      endpoint += `/?date=${date}`;
      args = [endpoint];
    }
    // return Observable.throw(new Error('no map data available'));

    this._http
      [method].apply(this._http, args)
      .map((res: Response) => {
        let jsonResult = res.json();

        // throw error here so that we can handle it properly later
        if (jsonResult.success === false) {
          throw new Error('Map Data not found.');
        }

        return jsonResult;
      })
      .subscribe((response: any) => {
        let tileUrl = this._tileLayerService.getEarthEngineMapUrl(response.mapId, response.mapToken);

        this._layerId = response.mapId;

        let payload: Layer = {
          id: this._layerId,
          url: tileUrl,
          type: 'rainfall',
          layerOptions: this._tileLayerService.getRainFallLayerOptions()
        };

        // clear tile layers before adding it
        this._mapService
          .clearTileLayers()
          .then(() => {
            // add the tile layer to the map
            return this._mapService.addNewTileLayer(payload.id, payload.url, payload.layerOptions);
          })
          .catch((error: Error) => {
            console.error(error);
          })
          ;

        // add the new layer to the store
        this._mapLayersStore.dispatch({
          type: 'ADD_LAYER',
          payload: payload
        });
      }, (error: Error) => {
        // send the error to the stream
        this._logger.log('Rainfall Map Data Unavailable', error.message, true);
      })
      ;
  }

  ngOnDestroy() {
    // remove all layers published on the store
    this._mapLayersStore.dispatch({
      type: 'REMOVE_ALL_LAYERS'
    });

    if (typeof this._layerId !== 'undefined') {
      this._mapService.removeTileLayer(this._layerId).catch((error: Error) => {
        console.error(error);
      });
    }
  }

}


