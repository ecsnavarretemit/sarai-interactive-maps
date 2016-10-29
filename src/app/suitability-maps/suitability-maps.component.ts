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
import { LeafletWmsLayerComponent } from '../leaflet-wms-layer/leaflet-wms-layer.component';
import { LayerState, SuitabilityLevelsState, Layer } from '../store';
import { WmsLayerService } from '../wms-layer.service';
import { WMSOptions } from 'leaflet';
import { map, omit } from 'lodash';
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
  private _mapLayers: Observable<LayerState>;
  private _suitabilityLevels: Observable<SuitabilityLevelsState>;
  private _combinedSubscription: Subscription;

  @ViewChildren(LeafletWmsLayerComponent) layers: QueryList<LeafletWmsLayerComponent>;

  constructor(
    private _wmsLayerService: WmsLayerService,
    private _route: ActivatedRoute,
    private _router: Router,
    private _mapLayersStore: Store<any>,
    private _suitabilityLevelsStore: Store<any>
  ) {
    // set the WMS tile URL
    this.WMSTileUrl = this._wmsLayerService.getUrl();

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
            (layer.data.wmsOptions as any).cql_filter = this._wmsLayerService.getCQLFilterByGridcode(levelsState.gridcodes);
          } else {
            layer.data.wmsOptions = (omit(layer.data.wmsOptions, 'cql_filter') as any);
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
  }

  processLayers() {
    let method = 'getSuitabilityMapCountryLevelLayers';
    let layerType = 'suitability-map-simplified';

    // get the layers
    let layers = this._wmsLayerService[method](this.crop);

    // assemble the layers payload for saving to the application store.
    let processedLayers = map(layers, (layer: WMSOptions) => {
      let payload: any = {};

      payload.id   = layer.layers;
      payload.type = layerType;
      payload.url  = this._wmsLayerService.getUrl();
      payload.data = {
        wmsOptions: layer
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

    // reset the layers collection to empty.
    this.layersCollection = [];
  }

  layerTracker(index, item) {
    // check if cql_filter is present. if it is then the layer has been modified.
    // return the cql_filter the the new identifier
    if (typeof item.data.wmsOptions.cql_filter !== 'undefined') {
      return item.data.wmsOptions.cql_filter;
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


