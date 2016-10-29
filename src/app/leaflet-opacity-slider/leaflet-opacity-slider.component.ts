/*!
 * Leaflet Opacity Slider Component
 *
 * Copyright(c) Exequiel Ceasar Navarrete <esnavarrete1@up.edu.ph>
 * Licensed under MIT
 */

import { Component, OnInit, OnDestroy, ViewChild, ElementRef, Input } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { Store } from '@ngrx/store';
import { WMS } from 'leaflet';
import { LayerState } from '../store';
import { LeafletMapService } from '../leaflet-map.service';

@Component({
  selector: 'app-leaflet-opacity-slider',
  templateUrl: './leaflet-opacity-slider.component.html',
  styleUrls: ['./leaflet-opacity-slider.component.sass']
})
export class LeafletOpacitySliderComponent implements OnInit, OnDestroy {
  public hasLayers: boolean;
  private _mapLayers: Observable<LayerState>;
  private _mapLayersSubscription: Subscription;

  @Input() title: string = 'Layer Overlay Opacity';
  @Input() opacity: number = 1;
  @ViewChild('controlwrapper') controlWrapper: ElementRef;
  @ViewChild('range') range: ElementRef;

  constructor(
    private _mapLayersStore: Store<any>,
    private _mapService: LeafletMapService
  ) {
    // add a flag to show or hide the control
    this.hasLayers = false;

    // get the map state store from the store
    this._mapLayers = this._mapLayersStore.select('mapLayers');

    // check if our store has layers and fire subscribe every 300ms
    this._mapLayersSubscription = this._mapLayers
      .debounceTime(300)
      .subscribe((layerState: LayerState) => {
        // set the flag to the value of the condition
        this.hasLayers = (layerState.ids.length > 0);
      })
      ;
  }

  ngOnInit() {
    // reflect the default value
    this.range.nativeElement.value = this.opacity;

    // set the default opacity
    this.setOpacity(this.opacity);
  }

  setOpacity(opacity: number) {
    this._mapService
      .getWMSLayers()
      .then((layers: any) => {
        _.each(layers, (layer: WMS) => {
          layer.setOpacity(opacity);
        });
      })
      ;
  }

  adjustOpacity(event) {
    this.setOpacity(this.range.nativeElement.value);
  }

  ngOnDestroy() {
    // unsubscribe to the store observable
    this._mapLayersSubscription.unsubscribe();
  }

}


