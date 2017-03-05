/*!
 * Crop Production Area Maps Component
 *
 * Copyright(c) Exequiel Ceasar Navarrete <esnavarrete1@up.edu.ph>
 * Licensed under MIT
 */

import { Component, Inject, OnInit, OnDestroy, QueryList, ViewChildren } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';
import { LayerState, Layer } from '../../../../store';
import { TileLayerService } from '../../../shared';
import { LeafletWmsLayerComponent, LeafletMapService } from '../../../../leaflet';
import { APP_CONFIG } from '../../../../app.config';
import { MAP_CONFIG } from '../../../map.config';
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
  public crop: string;
  public layersCollection: Observable<Array<Layer>>;
  private _pageTitle = 'Crop Production Area';
  private _wmsTileUrl: string;
  private _map: L.Map;
  private _mapLayers: Observable<any>;

  constructor(
    @Inject(MAP_CONFIG) private _mapConfig: any,
    @Inject(APP_CONFIG) private _globalConfig: any,
    private _mapService: LeafletMapService,
    private _tileLayerService: TileLayerService,
    private _route: ActivatedRoute,
    private _title: Title,
    private _mapLayersStore: Store<any>
  ) {
    const resolvedConfig = this._mapConfig.crop_production_area_maps;

    // set default wms tile layer
    this._wmsTileUrl = this._tileLayerService.getGeoServerWMSTileLayerBaseUrl(resolvedConfig.wms.workspace, resolvedConfig.wms.tiled);

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

      // set the page title
      this._title.setTitle(`${this._pageTitle} | ${this._globalConfig.app_title}`);

      // process wms layers
      this.processLayers();
    });
  }

  processLayers() {
    const layers = this._tileLayerService.getCropProductionAreaLayers(this.crop);

    // assemble the layers payload for saving to the application store.
    const processedLayers = map(layers, (layer: L.WMSOptions) => {
      const payload: Layer = {
        id: layer.layers,
        type: 'crop-production-area',
        url: this._wmsTileUrl,
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
    // reset the page title
    this._title.setTitle(`${this._globalConfig.app_title}`);

    // remove all layers published on the store and on the collection
    this.removeLayers();
  }

}


