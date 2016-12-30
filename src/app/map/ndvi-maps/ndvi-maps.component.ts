/*!
 * NDVI Maps Component
 *
 * Copyright(c) Exequiel Ceasar Navarrete <esnavarrete1@up.edu.ph>
 * Licensed under MIT
 */

import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { LeafletMapService } from '../../leaflet';
import { TileLayerService } from '../tile-layer.service';
import { AppLoggerService } from '../../app-logger.service';
import { Layer } from '../../store';
import * as L from 'leaflet';
import 'rxjs/add/observable/combineLatest';

// lodash imports
const isNaN = require('lodash/isNaN');

@Component({
  selector: 'app-ndvi-maps',
  templateUrl: './ndvi-maps.component.html',
  styleUrls: ['./ndvi-maps.component.sass']
})
export class NdviMapsComponent implements OnInit, OnDestroy {
  private _layerId: string;
  private _routerParamSubscription: Subscription;
  private _oldCenter: L.LatLngLiteral;
  private _oldZoom: number;

  constructor(
    private _mapService: LeafletMapService,
    private _tileLayerService: TileLayerService,
    private _logger: AppLoggerService,
    private _route: ActivatedRoute,
    private _mapLayersStore: Store<any>
  ) { }

  // TODO: create a reusable function to validate date format
  ngOnInit() {
    this._mapService
      .getMap()
      .then((map: L.Map) => {
        let {lat, lng} = map.getCenter();

        // store the lat and lng coordinates before we pan into the new coords.
        this._oldCenter = {
          lat,
          lng
        };

        // also store the zoom level
        this._oldZoom = map.getZoom();
      })
      ;

    // get the the route params and query parameters by
    // combining the latest values from the two observables
    this._routerParamSubscription = Observable
      .combineLatest(this._route.params, this._route.queryParams)
      .subscribe((params: [Params, Params]) => {
        let [routeParams, queryParams] = params;

        let converted = parseInt(routeParams['scanRange'], 10);

        // set the center of the map to the value of the center query parameter
        // and zoom to tha location
        if (typeof queryParams['center'] !== 'undefined') {
          let [lat, lng] = queryParams['center'].split(',');

          this._mapService.panTo(parseFloat(lat), parseFloat(lng), 10);
        }

        // check if startDate and scanRange is valid
        if (
          /^\d{4}[\/\-](0[1-9]|1[012])[\/\-](0?[1-9]|[12][0-9]|3[01])$/.test(routeParams['startDate']) &&
          !isNaN(converted)
        ) {
          this.processData(routeParams['startDate'], converted, queryParams['province']);
        }
      })
      ;
  }

  processData(startDate: string, scanRange: number, place?: string) {
    // remove all layers published on the store
    this._mapLayersStore.dispatch({
      type: 'REMOVE_ALL_LAYERS'
    });

    this._tileLayerService
      .getNdviLayerData(startDate, scanRange, place)
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
    // go the old zoom and lat,lng coords.
    this._mapService.panTo(this._oldCenter.lat, this._oldCenter.lng, this._oldZoom);

    // remove custom router subscription
    this._routerParamSubscription.unsubscribe();

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


