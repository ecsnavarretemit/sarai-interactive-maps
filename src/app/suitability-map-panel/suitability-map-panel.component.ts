/*!
 * Suitability Map Panel Component
 *
 * Copyright(c) Exequiel Ceasar Navarrete <esnavarrete1@up.edu.ph>
 * Licensed under MIT
 */

import { Component, OnInit, Output, ViewChild, ViewChildren, QueryList, ElementRef, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { SuitabilityMapService } from '../suitability-map.service';
import { SuitabilityLevel } from '../suitability-level.interface';
import { Crop } from '../crop.interface';
import * as _ from 'lodash';

@Component({
  selector: 'app-suitability-map-panel',
  templateUrl: './suitability-map-panel.component.html',
  styleUrls: ['./suitability-map-panel.component.sass']
})
export class SuitabilityMapPanelComponent implements OnInit {
  public cropData: Array<Crop> = [];
  public levels: Array<any> = [];

  @Output() panelIconClick: EventEmitter<Event> = new EventEmitter();
  @ViewChild('controlwrapper') controlWrapper: ElementRef;
  @ViewChildren('suitabilityLevel') suitabilityLevelsCheckBoxes: QueryList<ElementRef>;

  constructor(
    public router: Router,
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

  suitabilityRedirect(event, crop: string, containsChild = true) {
    if (containsChild) {
      return;
    }

    // redirect to the URL
    this.router.navigateByUrl(`/suitability-maps/${crop}`);
  }

  onPanelIconClick(event) {
    this.panelIconClick.emit(event);
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

}


