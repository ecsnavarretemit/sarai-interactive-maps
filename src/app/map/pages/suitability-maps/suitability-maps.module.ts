/*!
 * Suitability Maps Module
 *
 * Copyright(c) Exequiel Ceasar Navarrete <esnavarrete1@up.edu.ph>
 * Licensed under MIT
 */

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LeafletModule } from '../../../leaflet';
import { SuitabilityMapsRoutingModule } from './suitability-maps-routing.module';

import { SuitabilityMapsComponent } from './suitability-maps/suitability-maps.component';

@NgModule({
  imports: [
    CommonModule,
    LeafletModule,
    SuitabilityMapsRoutingModule,
  ],
  declarations: [
    SuitabilityMapsComponent,
  ],
  exports: [
    SuitabilityMapsComponent
  ]
})
export class SuitabilityMapsModule { }


