/*!
 * Suitability Map Panel Component
 *
 * Copyright(c) Exequiel Ceasar Navarrete <esnavarrete1@up.edu.ph>
 * Licensed under MIT
 */

import { Component, OnInit, Renderer } from '@angular/core';
import { basePanelAnimation, BasePanelComponent } from '../base-panel/base-panel.component';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';
import { LeafletMapService } from '../../../../leaflet';
import { SuitabilityMapService } from '../../../shared';
import { Crop } from '../../../crop.interface';
import map from 'lodash-es/map';
import omit from 'lodash-es/omit';

@Component({
  selector: 'app-suitability-map-panel',
  templateUrl: './suitability-map-panel.component.html',
  styleUrls: ['./suitability-map-panel.component.sass'],
  animations: [
    basePanelAnimation()
  ]
})
export class SuitabilityMapPanelComponent extends BasePanelComponent implements OnInit {
  public cropData: Observable<Array<Crop>>;
  public levels: Promise<Array<any>>;
  public controlWrapperAnimationState = 'hidden';

  constructor(
    private _router: Router,
    private _childRenderer: Renderer,
    private _childMapService: LeafletMapService,
    private _suitabilityMapService: SuitabilityMapService,
    private _store: Store<any>,
  ) {
    // call the parent constructor
    super(_childRenderer, _childMapService);
  }

  ngOnInit() {
    // call the parent's ngOnInit lifecycle hook
    super.ngOnInit();

    this.cropData = this._suitabilityMapService.getCropsOrganizedByType();

    // add the panel to the store
    this._store.dispatch({
      type: 'ADD_PANEL',
      payload: 'suitability-maps'
    });
  }

  togglePanelVisibility(immediate = false) {
    super.togglePanelVisibility(immediate);

    if (
      (this.controlWrapperAnimationState === 'visible' || this.controlWrapperAnimationState === 'visible-immediate') &&
      !this._router.isActive('/suitability-maps', false)
    ) {
      this._router.navigateByUrl('/suitability-maps');
    }

    if (
      (this.controlWrapperAnimationState === 'hidden' || this.controlWrapperAnimationState === 'hidden-immediate') &&
      this._router.isActive('/suitability-maps', false)
    ) {
      this._router.navigateByUrl('/');
    }
  }

  isCropActive(crop: string, ): boolean {
    return this._router.isActive(`/suitability-maps/${crop}`, true);
  }

  redirect(event, crop: string, containsChild = true) {
    if (containsChild) {
      return;
    }

    // redirect to the URL
    this._router.navigateByUrl(`/suitability-maps/${crop}`);
  }

  onHideButtonClick(evt: Event) {
    // call the parent method
    super.onHideButtonClick(evt);
  }

}


