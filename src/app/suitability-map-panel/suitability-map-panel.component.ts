/*!
 * Suitability Map Panel Component
 *
 * Copyright(c) Exequiel Ceasar Navarrete <esnavarrete1@up.edu.ph>
 * Licensed under MIT
 */

import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { LeafletMapService } from '../leaflet-map.service';
import { SuitabilityMapService } from '../suitability-map.service';
import { SuitabilityLevel } from '../suitability-level.interface';
import { Crop } from '../crop.interface';
import * as L from 'leaflet';
import * as _ from 'lodash';
import 'rxjs/add/operator/throttleTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/observable/fromEvent';
import {
  Component,
  OnInit,
  AfterViewInit,
  OnDestroy,
  Output,
  EventEmitter,
  ViewChild,
  ElementRef,
  Renderer,
  trigger,
  state,
  style,
  transition,
  animate
} from '@angular/core';

@Component({
  selector: 'app-suitability-map-panel',
  templateUrl: './suitability-map-panel.component.html',
  styleUrls: ['./suitability-map-panel.component.sass'],
  animations: [
    trigger('controlWrapper', [
      state('void', style({
        height: 0
      })),
      state('visible', style({
        opacity: 1,
        height: 'auto'
      })),
      state('hidden', style({
        opacity: 0,
        height: 0
      })),
      transition('* => *', animate(500))
    ])
  ]
})
export class SuitabilityMapPanelComponent implements OnInit, AfterViewInit, OnDestroy {
  public cropData: Array<Crop> = [];
  public levels: Array<any> = [];
  public controlWrapperAnimationState: string = 'hidden';
  private _mouseOverSubscription: Subscription;
  private _mouseLeaveListener: Function;

  @Output() hideButtonClick: EventEmitter<Event> = new EventEmitter<Event>();
  @ViewChild('controlwrapper') controlWrapper: ElementRef;

  constructor(
    public router: Router,
    private _renderer: Renderer,
    private _mapService: LeafletMapService,
    private _suitabilityMapService: SuitabilityMapService,
    private _store: Store<any>
  ) { }

  ngOnInit() {
    this._suitabilityMapService
      .getCrops()
      .then((crops: Array<Crop>) => {
        this.cropData = crops;
      })
      ;

    this._suitabilityMapService
      .getSuitabilityLevels()
      .then((levels: Array<SuitabilityLevel>) => {
        // add the suitability levels to the store
        this._store.dispatch({
          type: 'ADD_SUITABILITY_LEVELS',
          payload: levels
        });

        // add checked attribute
        this.levels = _.map(levels, (level: any) => {
          level.checked = true;

          return level;
        });
      })
      ;
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

  suitabilityRedirect(event, crop: string, containsChild = true) {
    if (containsChild) {
      return;
    }

    // redirect to the URL
    this.router.navigateByUrl(`/suitability-maps/${crop}`);
  }

  onHideButtonClick(event) {
    // switch the panel animation state to hidden
    this.controlWrapperAnimationState = 'hidden';

    this.hideButtonClick.emit(event);
  }

  togglePanelVisibility() {
    if (this.controlWrapperAnimationState === 'hidden') {
      this.controlWrapperAnimationState = 'visible';
      return;
    }

    this.controlWrapperAnimationState = 'hidden';
  }

  onToggleCheckbox(isChecked: boolean, level: any) {
    // set the value to the corresponding object
    level.checked = isChecked;

    if (isChecked) {
      // add the gridcode to the store
      this._store.dispatch({
        type: 'ADD_SUITABILITY_LEVEL',
        payload: _.omit(level, 'checked')
      });
    } else {
      // remove the gridcode from the store
      this._store.dispatch({
        type: 'REMOVE_SUITABILITY_LEVEL',
        payload: level.gridcode
      });
    }
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


