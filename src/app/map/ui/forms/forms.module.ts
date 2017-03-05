/*!
 * Forms Module (Map)
 *
 * Copyright(c) Exequiel Ceasar Navarrete <esnavarrete1@up.edu.ph>
 * Licensed under MIT
 */

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule as NgFormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

import { FormsModule as SaraiInteractiveMapsFormsModule } from '../../../forms';

import { DownloadImageFormComponent } from './download-image-form/download-image-form.component';
import { NdviFilterFormComponent } from './ndvi-filter-form/ndvi-filter-form.component';
import { RainfallMapFilterFormComponent } from './rainfall-map-filter-form/rainfall-map-filter-form.component';

@NgModule({
  imports: [
    CommonModule,
    NgFormsModule,
    ReactiveFormsModule,
    TranslateModule,
    SaraiInteractiveMapsFormsModule
  ],
  declarations: [
    NdviFilterFormComponent,
    RainfallMapFilterFormComponent,
    DownloadImageFormComponent
  ],
  exports: [
    DownloadImageFormComponent,
    NdviFilterFormComponent,
    RainfallMapFilterFormComponent
  ]
})
export class FormsModule { }


