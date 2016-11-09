/*!
 * Leaflet Opacity Slider Component
 *
 * Copyright(c) Exequiel Ceasar Navarrete <esnavarrete1@up.edu.ph>
 * Licensed under MIT
 */

import { Component, OnInit, AfterViewInit, OnDestroy, ViewChild, ElementRef, Input, Renderer } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { Store } from '@ngrx/store';
// import { LayerState } from '../store';
import { LeafletMapService } from '../leaflet-map.service';
import { assign, each } from 'lodash';
import * as L from 'leaflet';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/throttleTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/observable/fromEvent';

@Component({
  selector: 'app-leaflet-opacity-slider',
  templateUrl: './leaflet-opacity-slider.component.html',
  styleUrls: ['./leaflet-opacity-slider.component.sass']
})
export class LeafletOpacitySliderComponent implements OnInit, AfterViewInit, OnDestroy {
  public hasLayers: boolean;
  private _mapLayers: Observable<any>;
  private _mapLayersSubscription: Subscription;
  private _mouseOverSubscription: Subscription;
  private _mouseLeaveListener: Function;

  @Input() title: string = 'Layer Overlay Opacity';
  @Input() opacity: number = 1;
  @ViewChild('controlwrapper') controlWrapper: ElementRef;
  @ViewChild('range') range: ElementRef;

  constructor(
    private _mapLayersStore: Store<any>,
    private _mapService: LeafletMapService,
    private _renderer: Renderer
  ) {
    // add a flag to show or hide the control
    this.hasLayers = false;

    // // get the map state store from the store
    // this._mapLayers = this._mapLayersStore.select('mapLayers');
  }

  ngOnInit() {
    // // check if our store has layers and fire subscribe every 300ms
    // this._mapLayersSubscription = this._mapLayers
    //   .debounceTime(300)
    //   .subscribe((layerState: LayerState) => {
    //     // set the flag to the value of the condition
    //     this.hasLayers = (layerState.ids.length > 0);
    //   })
    //   ;

    // reflect the default value
    this._renderer.setElementProperty(this.range.nativeElement, 'value', this.opacity);

    // set the default opacity
    this.setOpacity(this.opacity);
  }

  ngAfterViewInit() {
    // since mouseover is fire continuously, we throttle it so that it is only fired every 600 ms
    this._mouseOverSubscription = Observable
      .fromEvent(this.controlWrapper.nativeElement, 'mouseover')
      .throttleTime(600)
      .subscribe(() => {
        this.mouseMovementOnMapControl('over');
      })
      ;

    // listen to the mouseleave event
    this._mouseLeaveListener = this._renderer.listen(this.controlWrapper.nativeElement, 'mouseleave', () => {
      this.mouseMovementOnMapControl('leave');
    });
  }

  setOpacity(opacity: number) {
    this._mapService.getMap().then((map: L.Map) => {
      map.eachLayer((layer: L.Layer) => {
        console.log(layer);
      });
    });
    // Promise
    //   .all([
    //     this._mapService.getWMSLayers(),
    //     this._mapService.getTileLayers()
    //   ])
    //   .then((values) => {
    //     let flattened = assign({}, ...values);

    //     each(flattened, (layer: L.TileLayer) => {
    //       layer.setOpacity(opacity);
    //     });
    //   })
    //   ;
  }

  adjustOpacity(event) {
    this.setOpacity(this.range.nativeElement.value);
  }

  mouseMovementOnMapControl(type: string) {
    this._mapService
      .getMap()
      .then((map: L.Map) => {
        if (type === 'over') {
          // disable dragging when the mouse is over the panel
          map.dragging.disable();

          // disable scroll wheel zoom when the mouse is over the panel
          map.scrollWheelZoom.disable();
        } else {
          // enable dragging when the mouse is not ove the panel
          map.dragging.enable();

          // enable scroll wheel zoom when the mouse is not ove the panel
          map.scrollWheelZoom.enable();
        }
      })
      ;
  }

  ngOnDestroy() {
    // // unsubscribe to the store observable
    // if (typeof this._mapLayersSubscription !== 'undefined') {
    //   this._mapLayersSubscription.unsubscribe();
    // }

    // remove event listener
    this._mouseLeaveListener();

    // remove the subscription from the event
    this._mouseOverSubscription.unsubscribe();
  }

}


