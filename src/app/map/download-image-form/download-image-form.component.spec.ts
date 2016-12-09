/* tslint:disable:no-unused-variable */

/*!
 * Download Image Form Component Test
 *
 * Copyright(c) Exequiel Ceasar Navarrete <esnavarrete1@up.edu.ph>
 * Licensed under MIT
 */

import { TestBed, async, inject } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { Http, BaseRequestOptions } from '@angular/http';
import { MockBackend } from '@angular/http/testing';
import { AppLoggerService } from '../../app-logger.service';
import { LocationsService } from '../locations.service';
import { SuitabilityMapService } from '../suitability-map.service';
import { MapConfig, MAP_CONFIG } from '../map.config';
import { DownloadImageFormComponent } from './download-image-form.component';

describe('Component: DownloadImageForm', () => {

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        MockBackend,
        BaseRequestOptions,
        FormBuilder,
        AppLoggerService,
        LocationsService,
        SuitabilityMapService,
        DownloadImageFormComponent,

        { provide: MAP_CONFIG, useValue: MapConfig },
        {
          provide: Http,
          deps: [MockBackend, BaseRequestOptions],
          useFactory: (backendInstance: MockBackend, defaultOptions: BaseRequestOptions) => {
            return new Http(backendInstance, defaultOptions);
          }
        },
      ]
    });
  });

  it('should create an instance', inject([DownloadImageFormComponent], (component: DownloadImageFormComponent) => {
    expect(component).toBeTruthy();
  }));

});


