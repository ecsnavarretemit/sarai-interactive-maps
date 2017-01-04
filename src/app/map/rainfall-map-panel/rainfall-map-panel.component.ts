/*!
 * Rainfall Map Panel Component
 *
 * Copyright(c) Exequiel Ceasar Navarrete <esnavarrete1@up.edu.ph>
 * Licensed under MIT
 */

import { Component, OnInit, Renderer } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { basePanelAnimation, BasePanelComponent } from '../base-panel/base-panel.component';
import { LeafletMapService } from '../../leaflet';
import { CustomValidators, FlatpickrOptions } from '../../forms';
import includes from 'lodash-es/includes';

@Component({
  selector: 'app-rainfall-map-panel',
  templateUrl: './rainfall-map-panel.component.html',
  styleUrls: ['./rainfall-map-panel.component.sass'],
  animations: [
    basePanelAnimation()
  ]
})
export class RainfallMapPanelComponent extends BasePanelComponent implements OnInit {
  public filterForm: FormGroup;
  public scanDate: FormControl;
  public datepickerOpts: FlatpickrOptions = {};
  public controlWrapperAnimationState: string = 'hidden';

  constructor(
    private _formBuilder: FormBuilder,
    private _router: Router,
    private _childRenderer: Renderer,
    private _childMapService: LeafletMapService
  ) {
    // call the parent constructor
    super(_childRenderer, _childMapService);

    this.scanDate = new FormControl('', [
      Validators.required,
      CustomValidators.dateISO
    ]);

    this.filterForm = this._formBuilder.group({
      scanDate: this.scanDate
    });
  }

  ngOnInit() {
    // call the pareng ngOnInit method
    super.ngOnInit();

    this.datepickerOpts = {
      disable: [
        (date: Date): boolean =>  {
          let allowedDates = [1, 6, 11, 16, 21, 26, 31];

          // only allow the dates specified in the variable
          return !includes(allowedDates, date.getDate());
        }
      ]
    }
  }

  processRequest() {
    let value = this.filterForm.value;

    // redirect to the URL
    this._router.navigateByUrl(`/rainfall-maps/${value.scanDate}`);
  }

}


