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
import { LeafletWmsLayerComponent, LeafletMapService } from '../../../../leaflet';
import { LayerState, SuitabilityLevelsState, Layer } from '../../../../store';
import { TileLayerService } from '../../../shared';
import { APP_CONFIG } from '../../../../app.config';
import { MAP_CONFIG } from '../../../map.config';
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
  private _pageTitle = 'Suitability Maps';
  private _map: L.Map;
  private _wmsTileUrl: string;
  private _layerState = 'resampled';
  private _mapLayers: Observable<any>;
  private _suitabilityLevels: Observable<any>;
  private _zoomEndListener: L.EventHandlerFn;

  @ViewChildren(LeafletWmsLayerComponent) layers: QueryList<LeafletWmsLayerComponent>;

  constructor(
    @Inject(APP_CONFIG) private _globalConfig: any,
    @Inject(MAP_CONFIG) private _mapConfig: any,
    private _mapService: LeafletMapService,
    private _tileLayerService: TileLayerService,
    private _route: ActivatedRoute,
    private _title: Title,
    private _store: Store<any>,
  ) {
    const resolvedConfig = this._mapConfig.suitability_maps;

    // set default crop
    this.crop = 'rice';

    // set default wms tile layer
    this._wmsTileUrl = this._tileLayerService.getGeoServerWMSTileLayerBaseUrl(resolvedConfig.wms.workspace, resolvedConfig.wms.tiled);

    // get the map state store from the store
    this._mapLayers = this._store.select('mapLayers');

    // get the suitability levels from the store
    this._suitabilityLevels = this._store.select('suitabilityLevels');

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
        const [layerState, levelsState] = states;

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
      this._title.setTitle(`${this._pageTitle} | ${this._globalConfig.app_title}`);

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
    const layerType = 'suitability-map-simplified';
    let zoomLevel = 6;
    let method = 'getSuitabilityMapCountryLevelLayers';

    if (typeof this._map !== 'undefined' && this._map.getZoom() >= 12) {
      zoomLevel = 12;
    }

    // get all municipal level layers when zoom level is greater than 12
    if (zoomLevel === 12) {
      method = 'getSuitabilityMapMunicipalLevelLayers';
    }

    // get the layers
    const layers = this._tileLayerService[method](this.crop);

    // assemble the layers payload for saving to the application store.
    const processedLayers = map(layers, (layer: L.WMSOptions) => {
      const payload: Layer = {
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
    this._store.dispatch({
      type: 'ADD_LAYERS',
      payload: processedLayers
    });
  }

  onMapZoom() {
    const zoomLevel = this._map.getZoom();

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
    this._store.dispatch({
      type: 'REMOVE_ALL_LAYERS'
    });
  }

  layerTracker(index, item) {
    let retval = item.id;

    // check if cql_filter is present. if it is then the layer has been modified.
    // append the cql_filter to the id to get a unique identifier
    if (typeof item.layerOptions.cql_filter !== 'undefined') {
      retval += item.layerOptions.cql_filter;
    }

    return retval;
  }

  ngOnDestroy() {
    // remove the event listener bound to the map
    this._map.off('zoomend', this._zoomEndListener);

    // reset the page title
    this._title.setTitle(`${this._globalConfig.app_title}`);

    // remove all layers published on the store and on the collection
    this.removeLayers();

    // remove the reference to the map
    this._map = null;
  }

}


