/*!
 * Rainfall Map Panel Component
 *
 * Copyright(c) Exequiel Ceasar Navarrete <esnavarrete1@up.edu.ph>
 * Licensed under MIT
 */

import { Component, OnInit, Renderer } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';
import { LeafletMapService } from '../../../../leaflet';
import { basePanelAnimation, BasePanelComponent } from '../base-panel/base-panel.component';

@Component({
  selector: 'app-rainfall-map-panel',
  templateUrl: './rainfall-map-panel.component.html',
  styleUrls: ['./rainfall-map-panel.component.sass'],
  animations: [
    basePanelAnimation()
  ]
})
export class RainfallMapPanelComponent extends BasePanelComponent implements OnInit {
  public controlWrapperAnimationState = 'hidden';

  constructor(
    private _router: Router,
    private _store: Store<any>,
    _renderer: Renderer,
    _mapService: LeafletMapService,
  ) {
    // call the parent constructor
    super(_renderer, _mapService);
  }

  ngOnInit() {
    super.ngOnInit();

    // add the panel to the store
    this._store.dispatch({
      type: 'ADD_PANEL',
      payload: 'rainfall-maps'
    });
  }

  togglePanelVisibility(immediate = false) {
    super.togglePanelVisibility(immediate);

    if (this.controlWrapperAnimationState === 'visible' || this.controlWrapperAnimationState === 'visible-immediate') {
      // add the panel to the store
      this._store.dispatch({
        type: 'ACTIVATE_PANEL',
        payload: 'rainfall-maps'
      });
    } else {
      // add the panel to the store
      this._store.dispatch({
        type: 'DEACTIVATE_PANEL',
        payload: 'rainfall-maps'
      });
    }
  }

  isMapActive(): boolean {
    return this._router.isActive(`/rainfall-maps`, false);
  }

  onHideButtonClick(evt: Event) {
    // call the parent method
    super.onHideButtonClick(evt);
  }

}


