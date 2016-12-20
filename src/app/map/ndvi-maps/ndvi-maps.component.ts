/*!
 * NDVI Maps Component
 *
 * Copyright(c) Exequiel Ceasar Navarrete <esnavarrete1@up.edu.ph>
 * Licensed under MIT
 */

import { Component, Inject, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Http, Response } from '@angular/http';
import { MAP_CONFIG } from '../map.config';
import { Store } from '@ngrx/store';
import { LeafletMapService } from '../../leaflet';
import { TileLayerService } from '../tile-layer.service';
import { AppLoggerService } from '../../app-logger.service';
import { Layer } from '../../store';
import { isNaN } from 'lodash';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/observable/combineLatest';

@Component({
  selector: 'app-ndvi-maps',
  templateUrl: './ndvi-maps.component.html',
  styleUrls: ['./ndvi-maps.component.sass']
})
export class NdviMapsComponent implements OnInit, OnDestroy {
  private _layerId: string;

  constructor(
    @Inject(MAP_CONFIG) private _config: any,
    private _mapService: LeafletMapService,
    private _tileLayerService: TileLayerService,
    private _logger: AppLoggerService,
    private _http: Http,
    private _route: ActivatedRoute,
    private _mapLayersStore: Store<any>
  ) { }

  // TODO: create a reusable function to validate date format
  ngOnInit() {
    // listen for changes in crop url parameter since `route.params` is an instance of Observable!
    this._route.params.forEach((params: Params) => {
      let converted = parseInt(params['scanRange'], 10);

      // check if startDate and scanRange is valid
      if (
        /^\d{4}[\/\-](0[1-9]|1[012])[\/\-](0?[1-9]|[12][0-9]|3[01])$/.test(params['startDate']) &&
        !isNaN(converted)
      ) {
        this.processData(params['startDate'], converted);
      }
    });
  }

  processData(startDate: string, scanRange: number) {
    // remove all layers published on the store
    this._mapLayersStore.dispatch({
      type: 'REMOVE_ALL_LAYERS'
    });

    // throw error if endpoint does not exist
    if (typeof this._config.ndvi_maps.eeApiEndpoint === 'undefined' || this._config.ndvi_maps.eeApiEndpoint === '') {
      throw new Error('API Endpoint for NDVI Layers not specified');
    }

    let endpoint = this._config.ndvi_maps.eeApiEndpoint;
    let method = 'post';
    let args = [endpoint, {
      date: startDate,
      range: scanRange
    }];

    if (this._config.ndvi_maps.eeApiEndpointMethod.toLowerCase() === 'get') {
      method = 'get';
      endpoint += `/${startDate}/${scanRange}`;
      args = [endpoint];
    }

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
          type: 'ndvi',
          layerOptions: this._tileLayerService.getNdviLayerOptions()
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
      }, (error) => {
        let message = error.message;

        if (typeof error.message === 'undefined') {
          message = 'Data Source not available. Please try again later.';
        }

        // send the error to the stream
        this._logger.log('NDVI Map Data Unavailable', message, true);
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


