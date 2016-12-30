/*!
 * NDVI Filter Form Component
 *
 * Copyright(c) Exequiel Ceasar Navarrete <esnavarrete1@up.edu.ph>
 * Licensed under MIT
 */

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, UrlTree, NavigationExtras } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { LeafletMapService } from '../../leaflet';
import { LocationsService } from '../locations.service';
import { CustomValidators } from '../../forms';

@Component({
  selector: 'app-ndvi-filter-form',
  templateUrl: './ndvi-filter-form.component.html',
  styleUrls: ['./ndvi-filter-form.component.sass']
})
export class NdviFilterFormComponent implements OnInit {
  public filterForm: FormGroup;
  public startDate: FormControl;
  public scanRange: FormControl;
  public province: FormControl;
  public provinces: Observable<any>;

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

    this.scanRange = new FormControl('', [
      Validators.required,
      CustomValidators.number
    ]);

    this.province = new FormControl('', [
      Validators.nullValidator
    ]);

    this.filterForm = this._formBuilder.group({
      startDate: this.startDate,
      scanRange: this.scanRange,
      province: this.province
    });
  }

  ngOnInit() {
    this.provinces = this._locationsService.getProvincesFromFT();
  }

  processRequest() {
    let value = this.filterForm.value;
    let urlExtras: NavigationExtras = {};
    let urlTree: UrlTree;

    if (value.province !== '') {
      // add a province query parameter
      urlExtras.queryParams = {
        province: value.province.name,
        center: `${value.province.center.coordinates[1]},${value.province.center.coordinates[0]}`
      };
    }

    // create the url tree
    urlTree = this._router.createUrlTree(['/ndvi', value.startDate, value.scanRange], urlExtras);

    // redirect to the URL
    this._router.navigateByUrl(urlTree);
  }

}


