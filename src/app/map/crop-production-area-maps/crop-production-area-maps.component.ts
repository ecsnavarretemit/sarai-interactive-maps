/*!
 * Crop Production Area Maps Component
 *
 * Copyright(c) Exequiel Ceasar Navarrete <esnavarrete1@up.edu.ph>
 * Licensed under MIT
 */

import { Component, OnInit, OnDestroy, QueryList, ViewChildren } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';
import { LayerState, Layer } from '../../store';
import { TileLayerService } from '../tile-layer.service';
import { LeafletWmsLayerComponent, LeafletMapService } from '../../leaflet';
import * as L from 'leaflet';
import map from 'lodash-es/map';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/debounceTime';

@Component({
  selector: 'app-crop-production-area-maps',
  templateUrl: './crop-production-area-maps.component.html',
  styleUrls: ['./crop-production-area-maps.component.sass']
})
export class CropProductionAreaMapsComponent implements OnInit, OnDestroy {
  public WMSTileUrl: string;
  public crop: string;
  public layersCollection: Observable<Array<Layer>>;
  private _map: L.Map;
  private _mapLayers: Observable<any>;

  constructor(
    private _mapService: LeafletMapService,
    private _tileLayerService: TileLayerService,
    private _route: ActivatedRoute,
    private _router: Router,
    private _mapLayersStore: Store<any>
  ) {
    // set the WMS tile URL
    this.WMSTileUrl = `http://202.92.144.40:8080/geoserver/sarai-crop-production-area-20161024/wms?tiled=true`;

    // set default crop
    this.crop = 'rice';

    // get the map state store from the store
    this._mapLayers = this._mapLayersStore.select('mapLayers');
  }

  ngOnInit() {
    this.layersCollection = this._mapLayers
      .debounceTime(300)
      .map((layerState: LayerState) => {
        return map(layerState.layers, (layer: Layer) => {
          return layer;
        });
      })
      ;

    // listen for changes in crop url parameter since `route.params` is an instance of Observable!
    this._route.params.forEach((params: Params) => {
      if (typeof params['crop'] !== 'undefined') {
        this.crop = params['crop'];
      }

      // process wms layers
      this.processLayers();
    });
  }

  processLayers() {
    let layers = this._tileLayerService.getCropProductionAreaLayers(this.crop);

    // assemble the layers payload for saving to the application store.
    let processedLayers = map(layers, (layer: L.WMSOptions) => {
      let payload: Layer = {
        id: layer.layers,
        type: 'crop-production-area',
        url: this.WMSTileUrl,
        layerOptions: layer
      };

      return payload;
    });

    // remove all layers present on the map
    this.removeLayers();

    // add the new layer to the store
    this._mapLayersStore.dispatch({
      type: 'ADD_LAYERS',
      payload: processedLayers
    });
  }

  removeLayers() {
    // remove all layers published on the store
    this._mapLayersStore.dispatch({
      type: 'REMOVE_ALL_LAYERS'
    });
  }

  ngOnDestroy() {
    // remove all layers published on the store and on the collection
    this.removeLayers();
  }

}


