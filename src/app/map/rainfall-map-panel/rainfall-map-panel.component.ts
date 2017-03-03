/*!
 * Rainfall Map Panel Component
 *
 * Copyright(c) Exequiel Ceasar Navarrete <esnavarrete1@up.edu.ph>
 * Licensed under MIT
 */

import { Component, Renderer } from '@angular/core';
import { Router } from '@angular/router';
import { LeafletMapService } from '../../leaflet';
import { basePanelAnimation, BasePanelComponent } from '../base-panel/base-panel.component';

@Component({
  selector: 'app-rainfall-map-panel',
  templateUrl: './rainfall-map-panel.component.html',
  styleUrls: ['./rainfall-map-panel.component.sass'],
  animations: [
    basePanelAnimation()
  ]
})
export class RainfallMapPanelComponent extends BasePanelComponent {
  public controlWrapperAnimationState = 'hidden';

  constructor(
    private _router: Router,
    _renderer: Renderer,
    _mapService: LeafletMapService
  ) {
    // call the parent constructor
    super(_renderer, _mapService);
  }

  isMapActive(): boolean {
    return this._router.isActive(`/rainfall-maps`, false);
  }

  onHideButtonClick(evt: Event) {
    // call the parent method
    super.onHideButtonClick(evt);
  }

}


