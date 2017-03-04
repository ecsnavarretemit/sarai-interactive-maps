/*!
 * Rainfall Maps Module
 *
 * Copyright(c) Exequiel Ceasar Navarrete <esnavarrete1@up.edu.ph>
 * Licensed under MIT
 */

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RainfallMapsRoutingModule } from './rainfall-maps-routing.module';

import { RainfallMapService } from './rainfall-map.service';

import { RainfallMapsComponent } from './rainfall-maps/rainfall-maps.component';

@NgModule({
  imports: [
    CommonModule,
    RainfallMapsRoutingModule
  ],
  declarations: [
    RainfallMapsComponent
  ],
  providers: [
    RainfallMapService
  ],
  exports: [
    RainfallMapsComponent
  ]
})
export class RainfallMapsModule { }


