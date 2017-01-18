/*!
 * Rainfall Map Filter Form Component
 *
 * Copyright(c) Exequiel Ceasar Navarrete <esnavarrete1@up.edu.ph>
 * Licensed under MIT
 */

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CustomValidators, FlatpickrOptions } from '../../forms';
import includes from 'lodash-es/includes';

@Component({
  selector: 'app-rainfall-map-filter-form',
  templateUrl: './rainfall-map-filter-form.component.html',
  styleUrls: ['./rainfall-map-filter-form.component.sass']
})
export class RainfallMapFilterFormComponent implements OnInit {
  public filterForm: FormGroup;
  public scanDate: FormControl;
  public datepickerOpts: FlatpickrOptions = {};

  constructor(
    private _formBuilder: FormBuilder,
    private _router: Router
  ) { }

  ngOnInit() {
    this.datepickerOpts = {
      disable: [
        (date: Date): boolean =>  {
          const allowedDates = [1, 6, 11, 16, 21, 26, 31];

          // only allow the dates specified in the variable
          return !includes(allowedDates, date.getDate());
        }
      ]
    };

    this.scanDate = new FormControl('', [
      Validators.required,
      CustomValidators.dateISO
    ]);

    this.filterForm = this._formBuilder.group({
      scanDate: this.scanDate
    });
  }

  processRequest() {
    const value = this.filterForm.value;

    // redirect to the URL
    this._router.navigateByUrl(`/rainfall-maps/${value.scanDate}`);
  }

}


