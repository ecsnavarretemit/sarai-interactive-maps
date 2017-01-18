/*!
 * Leaflet Tile Selector Component
 *
 * Copyright(c) Exequiel Ceasar Navarrete <esnavarrete1@up.edu.ph>
 * Licensed under MIT
 */

import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { LeafletMapService } from '../leaflet-map.service';
import { LeafletTileProviderService } from '../leaflet-tile-provider.service';
import { LeafletButtonComponent } from '../leaflet-button/leaflet-button.component';
import keys from 'lodash-es/keys';
import * as L from 'leaflet';
import 'rxjs/add/operator/throttleTime';
import 'rxjs/add/observable/fromEvent';
import {
  Component,
  OnInit,
  AfterViewInit,
  OnDestroy,
  ViewChild,
  Input,
  Output,
  EventEmitter,
  ElementRef,
  Renderer,
  trigger,
  state,
  style,
  transition,
  animate,
  AnimationTransitionEvent
} from '@angular/core';

@Component({
  selector: 'app-leaflet-tile-selector',
  templateUrl: './leaflet-tile-selector.component.html',
  styleUrls: ['./leaflet-tile-selector.component.sass'],
  animations: [
    trigger('controlWrapper', [
      state('visible', style({
        'opacity': 1,
        'display': 'block'
      })),
      state('hidden', style({
        'opacity': 0,
        'display': 'none'
      })),
      transition('* => *', animate(500))
    ]),
    trigger('button', [
      state('visible', style({
        'display': 'block'
      })),
      state('hidden', style({
        'display': 'none'
      }))
    ])
  ]
})
export class LeafletTileSelectorComponent implements OnInit, AfterViewInit, OnDestroy {
  public tileKeys: any;
  public tileProviderKey: string;
  public controlWrapperAnimationState: string = 'visible';
  public buttonState: string = 'hidden';
  private _mouseOverSubscription: Subscription;
  private _mouseLeaveListener: Function;

  @Input() controlTitle: string = 'Map Source';
  @Input() hideTooltipTxt: string = 'Hide';
  @Output() beforeHideControl: EventEmitter<AnimationTransitionEvent> = new EventEmitter<AnimationTransitionEvent>();
  @Output() afterHideControl: EventEmitter<AnimationTransitionEvent> = new EventEmitter<AnimationTransitionEvent>();
  @Output() beforeShowControl: EventEmitter<AnimationTransitionEvent> = new EventEmitter<AnimationTransitionEvent>();
  @Output() afterShowControl: EventEmitter<AnimationTransitionEvent> = new EventEmitter<AnimationTransitionEvent>();
  @ViewChild('controlwrapper') controlWrapper: ElementRef;
  @ViewChild('tileselector') tileSelector: ElementRef;
  @ViewChild(LeafletButtonComponent) controlSettings: LeafletButtonComponent;

  constructor(
    private _mapService: LeafletMapService,
    private _tileProvider: LeafletTileProviderService,
    private _renderer: Renderer
  ) {
    this.tileProviderKey = 'Google Satellite';
  }

  ngOnInit() {
    // extract the keys and tore to the property
    this.tileKeys = keys(this._tileProvider.baseMaps);

    this._mapService
      .getMap()
      .then((map: L.Map) => {
        // add default tile
        this._tileProvider.baseMaps[this.tileProviderKey].addTo(map);
      });
  }

  ngAfterViewInit() {
    // set default select value
    this._renderer.setElementProperty(this.tileSelector.nativeElement, 'value', this.tileProviderKey);

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

  onControlWrapperAnimationStart(event: AnimationTransitionEvent) {
    if (event.fromState === 'hidden' && event.toState === 'visible') {
      this.beforeShowControl.emit(event);
    }

    if (event.fromState === 'visible' && event.toState === 'hidden') {
      this.beforeHideControl.emit(event);
    }
  }

  onControlWrapperAnimationEnd(event: AnimationTransitionEvent) {
    if (event.fromState === 'visible' && event.toState === 'hidden') {
      this.afterHideControl.emit(event);
    }

    if (event.fromState === 'hidden' && event.toState === 'visible') {
      this.afterShowControl.emit(event);
    }
  }

  onHideControl(event) {
    // toggle animation states
    this.controlWrapperAnimationState = 'hidden';
    this.buttonState = 'visible';
  }

  onShowControl(event) {
    // toggle animation states
    this.controlWrapperAnimationState = 'visible';
    this.buttonState = 'hidden';
  }

  onTileChange(event: Event) {
    const value = (event.target as any).value;
    const resolvedTile = this._tileProvider.baseMaps[value];

    this._mapService
      .getMap()
      .then((map: L.Map) => {
        if (typeof resolvedTile !== 'undefined') {
          // remove the current layer
          map.removeLayer(this._tileProvider.baseMaps[this.tileProviderKey]);

          // add the new layer
          resolvedTile.addTo(map);

          // store the currently used tile
          this.tileProviderKey = value;
        }
      })
      ;
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
    // remove event listener
    this._mouseLeaveListener();

    // remove the subscription from the event
    this._mouseOverSubscription.unsubscribe();
  }

}


