/*!
 * Suitability Map Panel Component
 *
 * Copyright(c) Exequiel Ceasar Navarrete <esnavarrete1@up.edu.ph>
 * Licensed under MIT
 */

import { Component, OnInit, Renderer } from '@angular/core';
import { basePanelAnimation, BasePanelComponent } from '../base-panel/base-panel.component';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { LeafletMapService } from '../../leaflet';
import { SuitabilityMapService } from '../suitability-map.service';
import { SuitabilityLevel } from '../suitability-level.interface';
import { Crop } from '../crop.interface';
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
  public controlWrapperAnimationState: string = 'hidden';

  constructor(
    private _router: Router,
    private _childRenderer: Renderer,
    private _childMapService: LeafletMapService,
    private _suitabilityMapService: SuitabilityMapService,
    private _store: Store<any>
  ) {
    // call the parent constructor
    super(_childRenderer, _childMapService);
  }

  ngOnInit() {
    // call the parent's ngOnInit lifecycle hook
    super.ngOnInit();

    this.cropData = this._suitabilityMapService.getCropsOrganizedByType();

    this.levels = this._suitabilityMapService
      .getSuitabilityLevels()
      .then((levels: Array<SuitabilityLevel>) => {
        // add the suitability levels to the store
        this._store.dispatch({
          type: 'ADD_SUITABILITY_LEVELS',
          payload: levels
        });

        // add checked attribute
        return map(levels, (level: any) => {
          level.checked = true;

          return level;
        });
      })
      ;
  }

  isMapActive(): boolean {
    return this._router.isActive(`/suitability-maps`, false);
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

  onToggleCheckbox(isChecked: boolean, level: any) {
    // set the value to the corresponding object
    level.checked = isChecked;

    if (isChecked) {
      // add the gridcode to the store
      this._store.dispatch({
        type: 'ADD_SUITABILITY_LEVEL',
        payload: omit(level, 'checked')
      });
    } else {
      // remove the gridcode from the store
      this._store.dispatch({
        type: 'REMOVE_SUITABILITY_LEVEL',
        payload: level.gridcode
      });
    }
  }

}


