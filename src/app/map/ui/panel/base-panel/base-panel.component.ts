/*!
 * Base Panel Component
 *
 * Copyright(c) Exequiel Ceasar Navarrete <esnavarrete1@up.edu.ph>
 * Licensed under MIT
 */

import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { LeafletMapService } from '../../../../leaflet';
import * as L from 'leaflet';
import 'rxjs/add/operator/throttleTime';
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
  animate,
  AnimationEntryMetadata
} from '@angular/core';

export function basePanelAnimation(): AnimationEntryMetadata {
  return trigger('controlWrapper', [
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
    transition('void => visible', animate(500)),
    transition('visible => hidden', animate(500)),
    transition('hidden => void', animate(500)),
    transition('void => hidden', animate(500)),
    transition('hidden => visible', animate(500)),
    transition('visible => void', animate(500)),

    state('visible-immediate', style({
      opacity: 1,
      height: 'auto'
    })),
    state('hidden-immediate', style({
      opacity: 0,
      height: 0
    })),
    transition('void => visible-immediate', animate(0)),
    transition('visible-immediate => hidden-immediate', animate(0)),
    transition('hidden-immediate => void', animate(0)),
    transition('void => hidden-immediate', animate(0)),
    transition('hidden-immediate => visible-immediate', animate(0)),
    transition('visible-immediate => void', animate(0)),
  ]);
}

@Component({
  selector: 'app-base-panel',
  templateUrl: './base-panel.component.html',
  styleUrls: ['./base-panel.component.sass'],
  animations: [
    basePanelAnimation()
  ]
})
export class BasePanelComponent implements OnInit, AfterViewInit, OnDestroy {
  public controlWrapperAnimationState = 'hidden';
  private _mouseOverSubscription: Subscription;
  private _mouseLeaveListener: Function;

  @Output() hideButtonClick: EventEmitter<Event> = new EventEmitter<Event>();
  @ViewChild('controlwrapper') controlWrapper: ElementRef;

  constructor(
    private _renderer: Renderer,
    private _mapService: LeafletMapService,
  ) { }

  ngOnInit() { }

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

  onHideButtonClick(evt: Event) {
    // switch the panel animation state to hidden
    this.controlWrapperAnimationState = 'hidden';

    this.hideButtonClick.emit(evt);
  }

  togglePanelVisibility(immediate = false) {
    // store the state in a constant variable
    const [initialState, ...extraState] = this.controlWrapperAnimationState.split('-');

    // copy the first state and modify it
    let state = initialState;

    if (state === 'hidden') {
      state = 'visible';
    } else {
      state = 'hidden';
    }

    // show immediately without animating it
    if (immediate === true) {
      state += '-immediate';
    }

    this.controlWrapperAnimationState = state;
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


