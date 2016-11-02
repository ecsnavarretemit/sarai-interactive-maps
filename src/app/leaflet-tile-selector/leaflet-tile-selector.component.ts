/*!
 * Leaflet Tile Selector Component
 *
 * Copyright(c) Exequiel Ceasar Navarrete <esnavarrete1@up.edu.ph>
 * Licensed under MIT
 */

import { LeafletMapService } from '../leaflet-map.service';
import { LeafletTileProviderService } from '../leaflet-tile-provider.service';
import { LeafletButtonComponent } from '../leaflet-button/leaflet-button.component';
import { keys } from 'lodash';
import * as L from 'leaflet';
import {
  Component,
  OnInit,
  AfterViewInit,
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
export class LeafletTileSelectorComponent implements OnInit, AfterViewInit {
  public tileKeys: any;
  public tileProviderKey: string;
  public controlWrapperAnimationState: string = 'visible';
  public buttonState: string = 'hidden';

  @Input() controlTitle: string = 'Map Source';
  @Input() hideTooltipTxt: string = 'Hide';
  @Output() onBeforeHideControl: EventEmitter<AnimationTransitionEvent> = new EventEmitter<AnimationTransitionEvent>();
  @Output() onAfterHideControl: EventEmitter<AnimationTransitionEvent> = new EventEmitter<AnimationTransitionEvent>();
  @Output() onBeforeShowControl: EventEmitter<AnimationTransitionEvent> = new EventEmitter<AnimationTransitionEvent>();
  @Output() onAfterShowControl: EventEmitter<AnimationTransitionEvent> = new EventEmitter<AnimationTransitionEvent>();
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
  }

  onControlWrapperAnimationStart(event: AnimationTransitionEvent) {
    if (event.fromState === 'hidden' && event.toState === 'visible') {
      this.onBeforeShowControl.emit(event);
    }

    if (event.fromState === 'visible' && event.toState === 'hidden') {
      this.onBeforeHideControl.emit(event);
    }
  }

  onControlWrapperAnimationEnd(event: AnimationTransitionEvent) {
    if (event.fromState === 'visible' && event.toState === 'hidden') {
      this.onAfterHideControl.emit(event);
    }

    if (event.fromState === 'hidden' && event.toState === 'visible') {
      this.onAfterShowControl.emit(event);
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

  onTileChange(event) {
    let value = event.target.value;
    let resolvedTile = this._tileProvider.baseMaps[event.target.value];

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

}


