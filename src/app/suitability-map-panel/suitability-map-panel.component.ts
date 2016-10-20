/*!
 * Suitability Map Panel Component
 *
 * Copyright(c) Exequiel Ceasar Navarrete <esnavarrete1@up.edu.ph>
 * Licensed under MIT
 */

import { Component, OnInit, Output, ViewChild, ViewChildren, QueryList, ElementRef, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { WmsLayerService } from '../wms-layer.service';
import { SuitabilityMapService, Crop, SuitabilityLevels } from '../suitability-map.service';
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
    private _wmsLayerService: WmsLayerService,
    private _suitabilityMapService: SuitabilityMapService,
    private _store: Store<Array<any>>
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
      .then((levels: Array<SuitabilityLevels>) => {
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

    // get the gridcodes whose `level.checked` property is set to true
    let gridcodes: any = _.chain(this.levels)
      .filter({
        checked: true
      })
      .map('gridcode')
      .value()
      ;

    let url = this._wmsLayerService.getUrl();
    let data: any = {
      gridcodes: []
    };

    if (this.levels.length !== gridcodes.length) {
      data.gridcodes = gridcodes;

      url = this._wmsLayerService.getFilteredUrlByGridcode(gridcodes);
    }

    // dispatch the updated data
    this._store.dispatch({
      type: 'UPDATE_LAYERS_BY_ZOOM',
      payload: {
        url: url,
        zoom: 6,
        data
      }
    });
  }

}


