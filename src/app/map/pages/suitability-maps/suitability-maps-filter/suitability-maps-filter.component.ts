/*!
 * Suitability Maps Filter Component
 *
 * Copyright(c) Exequiel Ceasar Navarrete <esnavarrete1@up.edu.ph>
 * Licensed under MIT
 */

import { Component, OnInit, OnDestroy, Renderer } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';
import { Layer } from '../../../../store';
import { LeafletMapService } from '../../../../leaflet';
import { SuitabilityMapService } from '../../../shared';
import { SuitabilityLevel } from '../../../suitability-level.interface';
import { BasePanelComponent } from '../../../ui';
import map from 'lodash-es/map';
import omit from 'lodash-es/omit';
import values from 'lodash-es/values';

@Component({
  selector: 'app-suitability-maps-filter',
  templateUrl: './suitability-maps-filter.component.html',
  styleUrls: ['./suitability-maps-filter.component.sass']
})
export class SuitabilityMapsFilterComponent extends BasePanelComponent implements OnInit, OnDestroy {
  public levels: Promise<Array<any>>;
  private _suitabilityLevels: Observable<any>;

  constructor(
    private _childRenderer: Renderer,
    private _childMapService: LeafletMapService,
    private _suitabilityMapService: SuitabilityMapService,
    private _store: Store<any>,
  ) {
    // call the parent component constructor method
    super(_childRenderer, _childMapService);

    // get the suitability levels from the store
    this._suitabilityLevels = this._store.select('suitabilityLevels');
  }

  ngOnInit() {
    // TODO: temporary hack, we must have a flag enabled on each levels and those enabled are the
    //       ones returned.
    this._store.dispatch({
      type: 'REMOVE_SUITABILITY_LEVELS'
    });

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

  ngOnDestroy() {
    // make sure we destroy the component
    super.ngOnDestroy();
  }

}


