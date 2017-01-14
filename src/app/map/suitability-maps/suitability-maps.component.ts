/*!
 * Suitability Maps Component
 *
 * Copyright(c) Exequiel Ceasar Navarrete <esnavarrete1@up.edu.ph>
 * Licensed under MIT
 */

import { Component, Inject, OnInit, OnDestroy, ViewChildren, QueryList } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';
import { LeafletWmsLayerComponent, LeafletMapService } from '../../leaflet';
import { LayerState, SuitabilityLevelsState, Layer } from '../../store';
import { TileLayerService } from '../tile-layer.service';
import { MAP_CONFIG } from '../map.config';
import * as L from 'leaflet';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/observable/combineLatest';
import map from 'lodash-es/map';
import omit from 'lodash-es/omit';

@Component({
  selector: 'app-suitability-maps',
  templateUrl: './suitability-maps.component.html',
  styleUrls: ['./suitability-maps.component.sass']
})
export class SuitabilityMapsComponent implements OnInit, OnDestroy {
  public crop: string;
  public layersCollection: Observable<Array<Layer>>;
  private _pageTitle: string = 'Suitability Maps';
  private _map: L.Map;
  private _wmsTileUrl: string;
  private _layerState: string = 'resampled';
  private _mapLayers: Observable<any>;
  private _suitabilityLevels: Observable<any>;
  private _zoomEndListener: L.EventHandlerFn;

  @ViewChildren(LeafletWmsLayerComponent) layers: QueryList<LeafletWmsLayerComponent>;

  constructor(
    @Inject(MAP_CONFIG) private _config: any,
    private _mapService: LeafletMapService,
    private _tileLayerService: TileLayerService,
    private _route: ActivatedRoute,
    private _title: Title,
    private _mapLayersStore: Store<any>,
    private _suitabilityLevelsStore: Store<any>
  ) {
    let resolvedConfig = this._config.suitability_maps;

    // set default crop
    this.crop = 'rice';

    // set default wms tile layer
    this._wmsTileUrl = this._tileLayerService.getGeoServerWMSTileLayerBaseUrl(resolvedConfig.wms.workspace, resolvedConfig.wms.tiled);

    // get the map state store from the store
    this._mapLayers = this._mapLayersStore.select('mapLayers');

    // get the suitability levels from the store
    this._suitabilityLevels = this._suitabilityLevelsStore.select('suitabilityLevels');

    // make sure that the `this` value inside the onMapZoom is this component's instance.
    this._zoomEndListener = this.onMapZoom.bind(this);
  }

  ngOnInit() {
    // combine 2 observables to check for us to check if we need to provide cql_filter
    // to our layers and fire subscribe every 300ms
    this.layersCollection = Observable
      .combineLatest(this._mapLayers, this._suitabilityLevels)
      .debounceTime(300)
      .map((states: [LayerState, SuitabilityLevelsState]) => {
        let layerState = states[0];
        let levelsState = states[1];

        return map(layerState.layers, (layer: Layer) => {
          if (levelsState.gridcodes.length < 15) {
            (layer.layerOptions as any).cql_filter = this._tileLayerService.getCQLFilterByGridcode(levelsState.gridcodes);
          } else {
            layer.layerOptions = (omit(layer.layerOptions, 'cql_filter') as any);
          }

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
      this._title.setTitle(`${this._pageTitle} | ${this._config.app_title}`);

      // process wms layers
      this.processLayers();
    });

    // retrieve the map instance
    this._mapService
      .getMap()
      .then((mapInstance: L.Map) => {
        // save the reference to the map
        this._map = mapInstance;

        // bind the zoomend callback to the zoomend event
        mapInstance.on('zoomend', this._zoomEndListener);
      })
      ;
  }

  processLayers() {
    let zoomLevel = 6;
    let method = 'getSuitabilityMapCountryLevelLayers';
    let layerType = 'suitability-map-simplified';

    if (typeof this._map !== 'undefined' && this._map.getZoom() >= 12) {
      zoomLevel = 12;
    }

    // get all municipal level layers when zoom level is greater than 12
    if (zoomLevel === 12) {
      method = 'getSuitabilityMapMunicipalLevelLayers';
    }

    // get the layers
    let layers = this._tileLayerService[method](this.crop);

    // assemble the layers payload for saving to the application store.
    let processedLayers = map(layers, (layer: L.WMSOptions) => {
      let payload: Layer = {
        id: layer.layers,
        type: layerType,
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

  onMapZoom() {
    let zoomLevel = this._map.getZoom();

    if (zoomLevel < 12 && this._layerState !== 'resampled') {
      // processing layer
      this.processLayers();

      // switch layer state
      this._layerState = 'resampled';
    }

    if (zoomLevel >= 12 && this._layerState !== 'detailed') {
      // processing layer
      this.processLayers();

      // switch layer state
      this._layerState = 'detailed';
    }
  }

  removeLayers() {
    // remove all layers published on the store
    this._mapLayersStore.dispatch({
      type: 'REMOVE_ALL_LAYERS'
    });
  }

  layerTracker(index, item) {
    // check if cql_filter is present. if it is then the layer has been modified.
    // return the cql_filter the the new identifier
    if (typeof item.layerOptions.cql_filter !== 'undefined') {
      return item.layerOptions.cql_filter;
    }

    // return the item id if cql_filter is not present
    return item.id;
  }

  ngOnDestroy() {
    // remove the event listener bound to the map
    this._map.off('zoomend', this._zoomEndListener);

    // reset the page title
    this._title.setTitle(`${this._config.app_title}`);

    // remove all layers published on the store and on the collection
    this.removeLayers();

    // remove the reference to the map
    this._map = null;
  }

}


