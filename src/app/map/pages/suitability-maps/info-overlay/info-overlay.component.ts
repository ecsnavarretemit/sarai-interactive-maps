/*!
 * Info Overlay Component
 *
 * Copyright(c) Exequiel Ceasar Navarrete <esnavarrete1@up.edu.ph>
 * Licensed under MIT
 */

import { animate, AnimationEntryMetadata, Component, OnDestroy, OnInit, state, style, transition, trigger } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { Store } from '@ngrx/store';

export function baseInfoOverlayAnimation(): AnimationEntryMetadata {
  return trigger('infoOverlay', [
    state('void', style({
      transform: 'translate3d(0, 100%, 0)'
    })),
    state('visible', style({
      transform: 'translate3d(0, 0, 0)'
    })),
    state('hidden', style({
      transform: 'translate3d(0, 100%, 0)'
    })),
    transition('void => visible', animate(500)),
    transition('visible => hidden', animate(500)),
    transition('hidden => void', animate(500)),
    transition('void => hidden', animate(500)),
    transition('hidden => visible', animate(500)),
    transition('visible => void', animate(500)),
  ]);
}

@Component({
  selector: 'app-suitability-map-info-overlay',
  templateUrl: './info-overlay.component.html',
  styleUrls: ['./info-overlay.component.sass'],
  animations: [
    baseInfoOverlayAnimation()
  ]
})
export class InfoOverlayComponent implements OnDestroy, OnInit {
  public overlayAnimationState = 'hidden';
  private visibleText = 'Learn More';
  private hideText = 'Back to Suitability Maps';
  public btnText = this.visibleText;
  public visible = true;
  private _panelsState: Observable<any>;
  private _panelSubscription: Subscription;

  constructor(private _store: Store<any>) {
    // get the panels store
    this._panelsState = this._store.select('panels');
  }

  ngOnInit() {
    // subscribe to the changes to the panels state
    this._panelSubscription = this._panelsState
      .debounceTime(100)
      .subscribe((state: any) => {
        if (state.active === 'suitability-maps') {
          this.visible = true;
        } else {
          this.visible = false;
        }
      })
      ;
  }

  toggle() {
    if (this.overlayAnimationState === 'hidden') {
      this.overlayAnimationState = 'visible';
      this.btnText = this.hideText;
    } else {
      this.overlayAnimationState = 'hidden';
      this.btnText = this.visibleText;
    }
  }

  ngOnDestroy() {
    // remove subscription from the changes to the state
    this._panelSubscription.unsubscribe();
  }

}


