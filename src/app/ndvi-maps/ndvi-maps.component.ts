/*!
 * NDVI Maps Component
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
import { Layer } from '../store';
import { isNaN } from 'lodash';
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
    @Inject(APP_CONFIG) private _config: any,
    private _mapService: LeafletMapService,
    private _tileLayerService: TileLayerService,
    private _http: Http,
    private _route: ActivatedRoute,
    private _router: Router,
    private _mapLayersStore: Store<any>
  ) { }

  ngOnInit() {
    // listen for changes in crop url parameter since `route.params` is an instance of Observable!
    this._route.params.forEach((params: Params) => {
      let converted = parseInt(params['scanRange'], 10);
      // check if startDate and scanRange is valid
      if (
        typeof params['startDate'] !== 'undefined' &&
        typeof params['scanRange'] !== 'undefined' &&
        /^\d{4}[\/\-](0?[1-9]|1[012])[\/\-](0?[1-9]|[12][0-9]|3[01])/g.test(params['startDate']) &&
        !isNaN(converted)
      ) {
        this.processData(params['startDate'], parseInt(params['scanRange'], 10));
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
      endpoint += `/?date=${startDate}&range=${scanRange}`;
      args = [endpoint];
    }

    this._http
      [method].apply(this._http, args)
      .map((res: Response) => res.json())
      .subscribe((response: any) => {
        let tileUrl = `https://earthengine.googleapis.com/map/${response.mapId}/{z}/{x}/{y}?token=${response.mapToken}`;

        this._layerId = 'ndvi-layer-1';

        let payload: Layer = {
          id: this._layerId,
          url: tileUrl,
          type: 'ndvi',
          layerOptions: this._tileLayerService.getNdviLayerOptions()
        };

        // add the tile layer to the map
        this._mapService.addNewTileLayer(payload.id, payload.url, payload.layerOptions);

        // add the new layer to the store
        this._mapLayersStore.dispatch({
          type: 'ADD_LAYER',
          payload: payload
        });
      })
      ;
  }

  ngOnDestroy() {
    // remove all layers published on the store
    this._mapLayersStore.dispatch({
      type: 'REMOVE_ALL_LAYERS'
    });

    if (typeof this._layerId !== 'undefined') {
      this._mapService.removeTileLayer(this._layerId);
    }
  }

}


