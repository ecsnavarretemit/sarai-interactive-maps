/*!
 * Crop Production Area Maps Module
 *
 * Copyright(c) Exequiel Ceasar Navarrete <esnavarrete1@up.edu.ph>
 * Licensed under MIT
 */

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LeafletModule } from '../../../leaflet';
import { CropProductionAreaMapsRoutingModule } from './crop-production-area-maps-routing.module';

import { CropProductionAreaMapsComponent } from './crop-production-area-maps/crop-production-area-maps.component';

@NgModule({
  imports: [
    CommonModule,
    LeafletModule,
    CropProductionAreaMapsRoutingModule
  ],
  declarations: [
    CropProductionAreaMapsComponent
  ],
  exports: [
    CropProductionAreaMapsComponent
  ]
})
export class CropProductionAreaMapsModule { }


