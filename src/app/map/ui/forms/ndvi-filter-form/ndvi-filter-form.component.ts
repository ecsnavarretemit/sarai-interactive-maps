/*!
 * NDVI Filter Form Component
 *
 * Copyright(c) Exequiel Ceasar Navarrete <esnavarrete1@up.edu.ph>
 * Licensed under MIT
 */

import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, UrlTree, NavigationExtras } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { LeafletMapService } from '../../../../leaflet';
import { LocationsService } from '../../../shared';
import { CustomValidators, FlatpickrComponent, FlatpickrOptions } from '../../../../forms';
import * as moment from 'moment';

@Component({
  selector: 'app-ndvi-filter-form',
  templateUrl: './ndvi-filter-form.component.html',
  styleUrls: ['./ndvi-filter-form.component.sass']
})
export class NdviFilterFormComponent implements OnInit {
  public filterForm: FormGroup;
  public startDate: FormControl;
  public endDate: FormControl;
  public place: FormControl;
  public places: Observable<any>;
  public startDatepickerOpts: FlatpickrOptions = {};
  public endDatepickerOpts: FlatpickrOptions = {};

  @ViewChild('startDatePicker') startDatePicker: FlatpickrComponent;
  @ViewChild('endDatePicker') endDatePicker: FlatpickrComponent;

  constructor(
    private _router: Router,
    private _formBuilder: FormBuilder,
    private _locationsService: LocationsService,
    private _mapService: LeafletMapService
  ) {
    this.startDate = new FormControl('', [
      Validators.required,
      CustomValidators.dateISO
    ]);

    this.endDate = new FormControl('', [
      Validators.required,
      CustomValidators.dateISO
    ]);

    this.place = new FormControl('', [
      Validators.nullValidator
    ]);

    this.filterForm = this._formBuilder.group({
      startDate: this.startDate,
      endDate: this.endDate,
      place: this.place
    });
  }

  ngOnInit() {
    this.places = this._locationsService
      .getProvincesFromFT()
      .map((content: any) => {
        // add the philippines to the list of places
        content.places.unshift({
          name: 'Philippines'
        });

        return content;
      })
      ;

    this.startDatepickerOpts = {
      maxDate: moment().subtract(1, 'days').toDate()
    };

    this.endDatepickerOpts = {
      maxDate: new Date()
    };
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

    if (value.place !== '' && value.place.name !== 'Philippines') {
      // add a province query parameter
      urlExtras.queryParams = {
        province: value.place.name,
        center: `${value.place.center.coordinates[1]},${value.place.center.coordinates[0]}`
      };
    }

    // create the url tree
    urlTree = this._router.createUrlTree(['/ndvi', value.startDate, value.endDate], urlExtras);

    // redirect to the URL
    this._router.navigateByUrl(urlTree);
  }

}


