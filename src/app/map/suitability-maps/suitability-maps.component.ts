/*!
 * Suitability Maps Component
 *
 * Copyright(c) Exequiel Ceasar Navarrete <esnavarrete1@up.edu.ph>
 * Licensed under MIT
 */

import { Component, OnInit, OnDestroy, ViewChildren, QueryList } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { Store } from '@ngrx/store';
import { LeafletWmsLayerComponent, LeafletMapService } from '../../leaflet';
import { LayerState, SuitabilityLevelsState, Layer } from '../../store';
import { TileLayerService } from '../tile-layer.service';
import { map, omit } from 'lodash';
import * as L from 'leaflet';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/observable/combineLatest';

@Component({
  selector: 'app-suitability-maps',
  templateUrl: './suitability-maps.component.html',
  styleUrls: ['./suitability-maps.component.sass']
})
export class SuitabilityMapsComponent implements OnInit, OnDestroy {
  public WMSTileUrl: string;
  public crop: string;
  public layersCollection: Array<Layer> = [];
  private _map: L.Map;
  private _layerState: string = 'resampled';
  private _mapLayers: Observable<any>;
  private _suitabilityLevels: Observable<any>;
  private _combinedSubscription: Subscription;

  @ViewChildren(LeafletWmsLayerComponent) layers: QueryList<LeafletWmsLayerComponent>;

  constructor(
    private _mapService: LeafletMapService,
    private _tileLayerService: TileLayerService,
    private _route: ActivatedRoute,
    private _router: Router,
    private _mapLayersStore: Store<any>,
    private _suitabilityLevelsStore: Store<any>
  ) {
    // set the WMS tile URL
    this.WMSTileUrl = this._tileLayerService.getUrl();

    // set default crop
    this.crop = 'rice';

    // get the map state store from the store
    this._mapLayers = this._mapLayersStore.select('mapLayers');

    // get the suitability levels from the store
    this._suitabilityLevels = this._suitabilityLevelsStore.select('suitabilityLevels');
  }

  ngOnInit() {
    // combine 2 observables to check for us to check if we need to provide cql_filter
    // to our layers and fire subscribe every 300ms
    this._combinedSubscription = Observable
      .combineLatest(this._mapLayers, this._suitabilityLevels)
      .debounceTime(300)
      .map((states: [LayerState, SuitabilityLevelsState]) => {
        let layerState = states[0];
        let levelsState = states[1];

        let layers = map(layerState.layers, (layer: Layer) => {
          return layer;
        });

        return [layers, levelsState];
      })
      .subscribe((states: [Array<Layer>, SuitabilityLevelsState]) => {
        let layers = states[0];
        let levelsState = states[1];

        // TODO: determine if state is mutated here.
        // if yes, then refactor this part to prevent state mutation.
        this.layersCollection = map(layers, (layer: Layer) => {
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
        mapInstance.on('zoomend', this.onMapZoom.bind(this));
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
        url: this._tileLayerService.getUrl(),
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

    // reset the layers collection to empty.
    this.layersCollection = [];
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
    // remove all layers published on the store and on the collection
    this.removeLayers();

    // cleanup subscriptions
    this._combinedSubscription.unsubscribe();
  }

}


