/*!
 * Download Image Form Component
 *
 * Copyright(c) Exequiel Ceasar Navarrete <esnavarrete1@up.edu.ph>
 * Licensed under MIT
 */

import { Component, EventEmitter, isDevMode, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { AppLoggerService } from '../../../../app-logger.service';
import { LocationsService } from '../../../shared';
import { SuitabilityMapService } from '../../../suitability-map.service';
import { Crop } from '../../../crop.interface';
import each from 'lodash-es/each';
import map from 'lodash-es/map';
import parseInt from 'lodash-es/parseInt';
import reduce from 'lodash-es/reduce';
import trim from 'lodash-es/trim';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/combineLatest';

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
  public pdfFileDescriptiveName: string | null = null;
  private _regionChangeSubscription: Subscription;
  private _combinedRejectSubscription: Subscription;
  private _combinedResolveSubscription: Subscription;

  @Output() download: EventEmitter<any> = new EventEmitter<any>();
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
      .map((res) => {
        return map(res.result, (region: any) => {
          return {
            id: region.id,
            name: region.name,
            slug: region.slug
          };
        });
      })
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
        // reset the form element state when value is empty
        if (value === '') {
          this.selectProvince.setValue('');
          this.selectProvince.markAsPristine();
          this.selectProvince.markAsUntouched();
          this.selectProvince.disable();
          return;
        }

        // get the provinces from the API
        this.provinces = this._locationsService
          .getProvincesByRegionId(parseInt(value.id, 10))
          .map((res) => res.result)
          ;

        // enable the province select button
        this.selectProvince.enable();
      })
      ;

    this._combinedRejectSubscription = Observable
      .combineLatest(this.selectCrop.valueChanges, this.selectRegion.valueChanges, this.selectProvince.valueChanges)
      .filter((values: [any, any, any]) => {
        return (values[0] === '' || values[1] === '' || values[2] === '');
      })
      .debounceTime(300)
      .subscribe((values: [any, any, any]) => {
        this.pdfUrl = '#';
        this.pdfFilename = null;
        this.pdfFileDescriptiveName = null;
      })
      ;

    this._combinedResolveSubscription = Observable
      .combineLatest(this.selectCrop.valueChanges, this.selectRegion.valueChanges, this.selectProvince.valueChanges)
      .filter((values: [any, any, any]) => {
        return (values[0] !== '' && values[1] !== '' && values[2] !== '');
      })
      .debounceTime(300)
      .subscribe((values: [any, any, any]) => {
        const [crop, region, province] = values;
        const pdfFilename = `${crop.slug}-${province.slug}.pdf`;
        const pdfFileDescriptiveName = `${crop.name} - ${province.name}`;

        // reset to empty
        this.pdfFileDescriptiveName = null;
        this.pdfFilename = '';
        this.pdfUrl = '#';

        // check first if the resolved url exists by sending a HEAD request
        // if it exists save the actual filename.
        this._suitabilityMapService
          .checkIfSuitabilityMapImageExists(crop.slug, province.slug)
          .then((res: Response) => {
            // reflect the new values to the url, file name and descriptive file name
            this.pdfFileDescriptiveName = pdfFileDescriptiveName;
            this.pdfFilename = pdfFilename;
            this.pdfUrl = res.url;
          }, (res: Response) => {
            this.pdfFileDescriptiveName = pdfFileDescriptiveName;
            this.pdfFilename = pdfFilename;
            this.pdfUrl = '#';
          })
          ;
      })
      ;
  }

  onDownloadClick(e: Event) {
    if (this.pdfUrl === '' || this.pdfUrl === '#' || this.pdfUrl === false) {
      e.preventDefault();

      if (this.pdfUrl === false) {
        this._logger.log('Image not available', 'Map image not available.', true);
      }

      return;
    }

    let track = true;

    // set track to false when on dev mode
    if (isDevMode() === true) {
      track = false;
    }

    // emit event when download is executed
    this.download.emit({
      track,
      trackingProperties: {
        action: 'download',
        properties: {
          category: 'suitability-map-images',
          label: this.pdfFileDescriptiveName
        }
      }
    });
  }

  processRequest() {
    if (this.pdfFilename !== '' && (this.pdfUrl !== '' || this.pdfUrl !== '#')) {
       this.processComplete.emit({
        title: this.pdfFileDescriptiveName,
        filename: this.pdfFilename,
        url: this.pdfUrl
      });
    } else {
       this.processComplete.emit({
        title: false,
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


