/*!
 * Download Image Form Component
 *
 * Copyright(c) Exequiel Ceasar Navarrete <esnavarrete1@up.edu.ph>
 * Licensed under MIT
 */

import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { LocationsService } from '../locations.service';
import { SuitabilityMapService } from '../suitability-map.service';
import { Crop } from '../crop.interface';
import { trim, parseInt, reduce, each } from 'lodash';

@Component({
  selector: 'app-download-image-form',
  templateUrl: './download-image-form.component.html',
  styleUrls: ['./download-image-form.component.sass']
})
export class DownloadImageFormComponent implements OnInit, OnDestroy {
  public requestType = 'download';
  public downloadForm: FormGroup;
  public selectCrop: FormControl;
  public selectRegion: FormControl;
  public selectProvince: FormControl;
  public crops: Promise<Array<Crop>>;
  public regions: Observable<any>;
  public provinces: Observable<any>;
  public pdfUrl: string = '#';
  public pdfFilename: string | null = null;
  private _regionChangeSubscription: Subscription;
  private _provinceChangeSubscription: Subscription;

  constructor(
    private _formBuilder: FormBuilder,
    private _locationsService: LocationsService,
    private _suitabilityMapService: SuitabilityMapService
  ) {
    this.selectCrop = new FormControl('', [
      Validators.required
    ]);

    this.selectRegion = new FormControl('', [
      Validators.required
    ]);

    this.selectProvince = new FormControl('', [
      Validators.required
    ]);

    this.downloadForm = this._formBuilder.group({
      selectCrop: this.selectCrop,
      selectRegion: this.selectRegion,
      selectProvince: this.selectProvince
    });
  }

  ngOnInit() {
    // populate the region select field
    this.regions = this._locationsService.getRegions();

    // populate the crop select field
    this.crops = this._suitabilityMapService
      .getCrops()
      .then((crops: Array<Crop>) => {
        let transformedValue: Array<Crop> = reduce(crops, (values: Array<Crop>, crop: Crop) => {
          if (typeof crop.subcrops === 'undefined') {
            values.push(crop);
          } else {
            each(crop.subcrops, (subcrop: Crop) => {
              values.push(subcrop);
            });
          }

          return values;
        }, []);

        return Promise.resolve(transformedValue);
      })
      ;

    // disable on load
    this.selectProvince.disable();

    this._regionChangeSubscription = this.selectRegion.valueChanges
      .subscribe((value: any) => {
        let trimmed = trim(value);

        // reset the form element state when value is empty
        if (trimmed === '') {
          this.selectProvince.setValue('');
          this.selectProvince.markAsPristine();
          this.selectProvince.markAsUntouched();
          this.selectProvince.disable();
          return;
        }

        // get the provinces from the API
        this.provinces = this._locationsService.getProvincesByRegionId(parseInt(trimmed, 10));

        // enable the province select button
        this.selectProvince.enable();
      })
      ;

    this._provinceChangeSubscription = this.selectProvince.valueChanges
      .subscribe((value: any) => {
        let trimmed = trim(value);

        // reset the form element state when value is empty
        if (trimmed === '' || this.selectCrop.value === '#') {
          this.pdfUrl = '#';
          this.pdfFilename = null;
          return;
        }

        // reflect the new values to the url and file name
        this.pdfFilename = `${this.selectCrop.value}-${value}.pdf`;
        this.pdfUrl = `/assets/docs/crops/${this.selectCrop.value}/${value}.pdf`;
      })
      ;
  }

  download(e: Event) {
    if (this.pdfUrl === '' || this.pdfUrl === '#') {
      e.preventDefault();
    }
  }

  processRequest() {
    let value = this.downloadForm.value;
    console.log(value);
  }

  ngOnDestroy() {
    // unsubscribe to the changes in subscription element
    this._regionChangeSubscription.unsubscribe();
  }

}


