/*!
 * NDVI Panel Component
 *
 * Copyright(c) Exequiel Ceasar Navarrete <esnavarrete1@up.edu.ph>
 * Licensed under MIT
 */

import { Component, OnInit, Renderer } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';
import { LeafletMapService } from '../../../../leaflet';
import { basePanelAnimation, BasePanelComponent } from '../base-panel/base-panel.component';

@Component({
  selector: 'app-ndvi-panel',
  templateUrl: './ndvi-panel.component.html',
  styleUrls: ['./ndvi-panel.component.sass'],
  animations: [
    basePanelAnimation()
  ]
})
export class NdviPanelComponent extends BasePanelComponent implements OnInit {
  public controlWrapperAnimationState = 'hidden';

  constructor(
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
      payload: 'ndvi-maps'
    });
  }

  togglePanelVisibility(immediate = false) {
    super.togglePanelVisibility(immediate);

    if (this.controlWrapperAnimationState === 'visible' || this.controlWrapperAnimationState === 'visible-immediate') {
      // add the panel to the store
      this._store.dispatch({
        type: 'ACTIVATE_PANEL',
        payload: 'ndvi-maps'
      });
    } else {
      // add the panel to the store
      this._store.dispatch({
        type: 'DEACTIVATE_PANEL',
        payload: 'ndvi-maps'
      });
    }
  }

  onHideButtonClick(evt: Event) {
    // call the parent method
    super.onHideButtonClick(evt);
  }

}


