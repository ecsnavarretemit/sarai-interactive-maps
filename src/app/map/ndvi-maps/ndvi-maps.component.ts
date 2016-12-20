/*!
 * NDVI Maps Component
 *
 * Copyright(c) Exequiel Ceasar Navarrete <esnavarrete1@up.edu.ph>
 * Licensed under MIT
 */

import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Http } from '@angular/http';
import { Store } from '@ngrx/store';
import { LeafletMapService } from '../../leaflet';
import { TileLayerService } from '../tile-layer.service';
import { AppLoggerService } from '../../app-logger.service';
import { Layer } from '../../store';
import { isNaN } from 'lodash';

@Component({
  selector: 'app-ndvi-maps',
  templateUrl: './ndvi-maps.component.html',
  styleUrls: ['./ndvi-maps.component.sass']
})
export class NdviMapsComponent implements OnInit, OnDestroy {
  private _layerId: string;

  constructor(
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

    this._tileLayerService
      .getNdviLayerData(startDate, scanRange)
      .then((response: any) => {
        let tileUrl = this._tileLayerService.getEarthEngineMapUrl(response.mapId, response.mapToken);

        // assemble the layer
        let layer: Layer = {
          id: response.mapId,
          url: tileUrl,
          type: 'ndvi',
          layerOptions: this._tileLayerService.getNdviLayerOptions()
        };

        // set the layer id for the component instance
        this._layerId = response.mapId;

        // clear tile layers before adding it
        return Promise.all([
          Promise.resolve(layer),
          this._mapService.clearTileLayers()
        ]);
      })
      .then((resolvedValue: any) => {
        let layer: Layer = resolvedValue[0];

        // add the new layer to the store
        this._mapLayersStore.dispatch({
          type: 'ADD_LAYER',
          payload: layer
        });

        return this._mapService.addNewTileLayer(layer.id, layer.url, layer.layerOptions);
      })
      .catch((error) => {
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
      this._mapService
        .removeTileLayer(this._layerId)
        .catch((error: Error) => {
          console.error(error);
        })
        ;
    }
  }

}


