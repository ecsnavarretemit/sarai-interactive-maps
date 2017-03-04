/*!
 * NDVI Maps Module
 *
 * Copyright(c) Exequiel Ceasar Navarrete <esnavarrete1@up.edu.ph>
 * Licensed under MIT
 */

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NdviMapsRoutingModule } from './ndvi-maps-routing.module';

import { NdviMapService } from './ndvi-map.service';

import { NdviMapsComponent } from './ndvi-maps/ndvi-maps.component';

@NgModule({
  imports: [
    CommonModule,
    NdviMapsRoutingModule
  ],
  declarations: [
    NdviMapsComponent
  ],
  providers: [
    NdviMapService
  ],
  exports: [
    NdviMapsComponent
  ]
})
export class NdviMapsModule { }


