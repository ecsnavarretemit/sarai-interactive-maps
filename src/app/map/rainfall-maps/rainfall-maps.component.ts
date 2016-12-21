/*!
 * Rainfall Maps Component
 *
 * Copyright(c) Exequiel Ceasar Navarrete <esnavarrete1@up.edu.ph>
 * Licensed under MIT
 */

import { Component, Inject, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { MAP_CONFIG } from '../map.config';
import { Store } from '@ngrx/store';
import { LeafletMapService } from '../../leaflet';
import { TileLayerService } from '../tile-layer.service';
import { AppLoggerService } from '../../app-logger.service';
import { Layer } from '../../store';
import 'rxjs/add/operator/map';

@Component({
  selector: 'app-rainfall-maps',
  templateUrl: './rainfall-maps.component.html',
  styleUrls: ['./rainfall-maps.component.sass']
})
export class RainfallMapsComponent implements OnInit, OnDestroy {
  private _layerId: string;

  constructor(
    @Inject(MAP_CONFIG) private _config: any,
    private _mapService: LeafletMapService,
    private _tileLayerService: TileLayerService,
    private _logger: AppLoggerService,
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

    this._tileLayerService
      .getRainfallMapLayerData(date)
      .then((response: any) => {
        let tileUrl = this._tileLayerService.getEarthEngineMapUrl(response.mapId, response.mapToken);

        // assemble the layer
        let layer: Layer = {
          id: response.mapId,
          url: tileUrl,
          type: 'rainfall',
          layerOptions: this._tileLayerService.getRainFallLayerOptions()
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
      .catch((error: Error) => {
        let message = error.message;

        if (typeof error.message === 'undefined') {
          message = 'Data Source not available. Please try again later.';
        }

        // send the error to the stream
        this._logger.log('Rainfall Map Data Unavailable', message, true);
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


