/*!
 * Services Module
 *
 * Copyright(c) Exequiel Ceasar Navarrete <esnavarrete1@up.edu.ph>
 * Licensed under MIT
 */

import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LocationsService } from './locations.service';
import { TileLayerService } from './tile-layer.service';

@NgModule({
  imports: [
    CommonModule
  ]
})
export class ServicesModule {

  static forRoot(): ModuleWithProviders {
    return {
      ngModule: ServicesModule,
      providers: [
        LocationsService,
        TileLayerService
      ]
    };
  }

}


