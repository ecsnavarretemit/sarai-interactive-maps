/*!
 * Rainfall Map Filter Form Component
 *
 * Copyright(c) Exequiel Ceasar Navarrete <esnavarrete1@up.edu.ph>
 * Licensed under MIT
 */

import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, UrlTree, NavigationExtras } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { CustomValidators, FlatpickrComponent, FlatpickrOptions } from '../../../../forms';
import { LocationsService } from '../../../shared';
import assign from 'lodash-es/assign';
import includes from 'lodash-es/includes';
import * as moment from 'moment';

@Component({
  selector: 'app-rainfall-map-filter-form',
  templateUrl: './rainfall-map-filter-form.component.html',
  styleUrls: ['./rainfall-map-filter-form.component.sass']
})
export class RainfallMapFilterFormComponent implements OnInit {
  public filterForm: FormGroup;
  public startDate: FormControl;
  public endDate: FormControl;
  public province: FormControl;
  public provinces: Observable<any>;
  public startDatepickerOpts: FlatpickrOptions = {};
  public endDatepickerOpts: FlatpickrOptions = {};

  @ViewChild('startDatePicker') startDatePicker: FlatpickrComponent;
  @ViewChild('endDatePicker') endDatePicker: FlatpickrComponent;

  constructor(
    private _formBuilder: FormBuilder,
    private _router: Router,
    private _locationsService: LocationsService
  ) { }

  ngOnInit() {
    this.startDatepickerOpts = {
      maxDate: moment().subtract(1, 'days').toDate(),
      disable: [
        (date: Date): boolean =>  {
          const allowedDates = [1, 6, 11, 16, 21, 26, 31];

          // only allow the dates specified in the variable
          return !includes(allowedDates, date.getDate());
        }
      ]
    };

    this.endDatepickerOpts = assign({}, this.startDatepickerOpts, {
      maxDate: new Date()
    });

    this.startDate = new FormControl('', [
      Validators.required,
      CustomValidators.dateISO
    ]);

    this.endDate = new FormControl('', [
      Validators.required,
      CustomValidators.dateISO
    ]);

    this.province = new FormControl('', [
      Validators.nullValidator
    ]);

    this.filterForm = this._formBuilder.group({
      startDate: this.startDate,
      endDate: this.endDate,
      province: this.province
    });

    this.provinces = this._locationsService.getProvincesFromFT();
  }

  onStartDateChange(date: string) {
    const parsedDate = moment(date, 'YYYY-MM-DD');

    // add 1 day to the parsed date
    parsedDate.add(1, 'days');

    // save the formatted date
    const formattedDate = parsedDate.format('YYYY-MM-DD');

    // set the minimum date for the end datepicker
    this.endDatePicker.setOption('minDate', formattedDate);

    // close the start datepicker
    this.startDatePicker.hidePicker();

    // show the end datepicker
    setTimeout(() => {
      this.endDatePicker.showPicker();

      this.endDatePicker.jumpToDate(formattedDate);
    }, 0);
  }

  processRequest() {
    const value = this.filterForm.value;
    const urlExtras: NavigationExtras = {};
    let urlTree: UrlTree;

    if (value.province !== '') {
      // add a province query parameter
      urlExtras.queryParams = {
        province: value.province.name,
        center: `${value.province.center.coordinates[1]},${value.province.center.coordinates[0]}`
      };
    }

    // create the url tree
    urlTree = this._router.createUrlTree(['/rainfall-maps', value.startDate, value.endDate], urlExtras);

    // redirect to the URL
    this._router.navigateByUrl(urlTree);
  }

}


