/*!
 * Download Image Form Component
 *
 * Copyright(c) Exequiel Ceasar Navarrete <esnavarrete1@up.edu.ph>
 * Licensed under MIT
 */

import { Component, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { AppLoggerService } from '../../app-logger.service';
import { LocationsService } from '../locations.service';
import { SuitabilityMapService } from '../suitability-map.service';
import { Crop } from '../crop.interface';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/combineLatest';

// lodash imports
const each = require('lodash/each');
const map = require('lodash/map');
const parseInt = require('lodash/parseInt');
const reduce = require('lodash/reduce');
const trim = require('lodash/trim');

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
  public crops: Observable<Array<Crop>>;
  public regions: Observable<any>;
  public provinces: Observable<any>;
  public pdfUrl: string | boolean = '#';
  public pdfFilename: string | boolean | null = null;
  private _regionChangeSubscription: Subscription;
  private _combinedRejectSubscription: Subscription;
  private _combinedResolveSubscription: Subscription;

  @Output() processComplete: EventEmitter<any> = new EventEmitter<any>();

  constructor(
    private _formBuilder: FormBuilder,
    private _locationsService: LocationsService,
    private _suitabilityMapService: SuitabilityMapService,
    private _logger: AppLoggerService
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
    this.regions = this._locationsService
      .getRegions()
      .map((res) => res.result)
      .catch((err: any) => {
        // catch the error but do nothing
        return Observable.of(null);
      })
      ;

    // populate the crop select field
    this.crops = this._suitabilityMapService
      .getCrops()
      .map((crops: any) => {
        return map(crops.result, (crop: any) => {
          return {
            name: crop.name,
            slug: crop.slug
          };
        });
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
        this.provinces = this._locationsService
          .getProvincesByRegionId(parseInt(trimmed, 10))
          .map((res) => res.result)
          ;

        // enable the province select button
        this.selectProvince.enable();
      })
      ;

    this._combinedRejectSubscription = Observable
      .combineLatest(this.selectCrop.valueChanges, this.selectRegion.valueChanges, this.selectProvince.valueChanges)
      .filter((values: [string, string, string]) => {
        return (values[0] === '' || values[1] === '' || values[2] === '');
      })
      .debounceTime(300)
      .subscribe((values: [string, string, string]) => {
        this.pdfUrl = '#';
        this.pdfFilename = null;
      })
      ;

    this._combinedResolveSubscription = Observable
      .combineLatest(this.selectCrop.valueChanges, this.selectRegion.valueChanges, this.selectProvince.valueChanges)
      .filter((values: [string, string, string]) => {
        return (values[0] !== '' && values[1] !== '' && values[2] !== '');
      })
      .debounceTime(300)
      .subscribe((values: [string, string, string]) => {
        let [crop, region, province] = values;
        let pdfFilename = `${crop}-${province}.pdf`;

        // reset to empty
        this.pdfFilename = '';
        this.pdfUrl = '#';

        // check first if the resolved url exists by sending a HEAD request
        // if it exists save the actual filename.
        this._suitabilityMapService
          .checkIfSuitabilityMapImageExists(crop, province)
          .then((res: Response) => {
            // reflect the new values to the url and file name
            this.pdfFilename = pdfFilename;
            this.pdfUrl = res.url;
          }, (res: Response) => {
            this.pdfFilename = pdfFilename;
            this.pdfUrl = '#';
          })
          ;
      })
      ;
  }

  download(e: Event) {
    if (this.pdfUrl === '' || this.pdfUrl === '#' || this.pdfUrl === false) {
      e.preventDefault();

      if (this.pdfUrl === false) {
        this._logger.log('Image not available', 'Map image not available.', true);
      }
    }
  }

  processRequest() {
    if (this.pdfFilename !== '' && (this.pdfUrl !== '' || this.pdfUrl !== '#')) {
       this.processComplete.emit({
        filename: this.pdfFilename,
        url: this.pdfUrl
      });
    } else {
       this.processComplete.emit({
        filename: false,
        url: false
      });
    }
  }

  ngOnDestroy() {
    // unsubscribe to the changes in subscription element
    this._regionChangeSubscription.unsubscribe();
    this._combinedRejectSubscription.unsubscribe();
    this._combinedResolveSubscription.unsubscribe();
  }

}


