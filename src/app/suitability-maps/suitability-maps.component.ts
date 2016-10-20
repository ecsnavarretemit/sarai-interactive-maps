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
import { WmsLayerService } from '../wms-layer.service';
import { WMSOptions } from 'leaflet';
import { map } from 'lodash';

@Component({
  selector: 'app-suitability-maps',
  templateUrl: './suitability-maps.component.html',
  styleUrls: ['./suitability-maps.component.sass']
})
export class SuitabilityMapsComponent implements OnInit, OnDestroy {
  public WMSTileUrl: string;
  public crop: string;
  public layersCollection: Array<any> = [];
  private _mapState: Observable<Array<any>>;
  private _mapStateSubscription: Subscription;

  @ViewChildren(LeafletWmsLayerComponent) layers: QueryList<LeafletWmsLayerComponent>;

  constructor(
    private _wmsLayerService: WmsLayerService,
    private _route: ActivatedRoute,
    private _router: Router,
    private _store: Store<Array<any>>
  ) {
    // set the WMS tile URL
    this.WMSTileUrl = this._wmsLayerService.getUrl();

    // set default crop
    this.crop = 'rice';

    // get the map state store from the store
    this._mapState = this._store.select('map');
  }

  ngOnInit() {
    // specify the crop
    this._route.params.forEach((params: Params) => {
      if (typeof params['crop'] !== 'undefined') {
        this.crop = params['crop'];
      }
    });

    // listen to the changes in map state and fire subscribe every 300ms
    this._mapStateSubscription = this._mapState
      .debounceTime(300)
      .subscribe((layers) => {
        this.layersCollection = layers;
      });

    // assemble the layers payload for saving to the application store.
    let layers = map(this._wmsLayerService.getSuitabilityMapCountryLevelLayers(this.crop), (layer: WMSOptions) => {
      let payload: any = {};

      payload.id = layer.layers;
      payload.zoom = 6;
      payload.url = this._wmsLayerService.getUrl();
      payload.data = {
        wmsOptions: layer
      };

      return payload;
    });

    // add the new layer to the store
    this._store.dispatch({
      type: 'ADD_LAYERS',
      payload: layers
    });
  }

  ngOnDestroy() {
    // add the new layer to the store
    this._store.dispatch({
      type: 'REMOVE_ALL_LAYERS'
    });

    // reset the layers collection to empty.
    this.layersCollection = [];

    // cleanup subscription
    this._mapStateSubscription.unsubscribe();
  }

}


