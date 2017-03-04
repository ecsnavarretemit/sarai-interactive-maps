/*!
 * Map Module
 *
 * Copyright(c) Exequiel Ceasar Navarrete <esnavarrete1@up.edu.ph>
 * Licensed under MIT
 */

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LeafletModule } from '../leaflet';
import { SharedModule } from './shared';
import { PagesModule } from './pages';

import { WindowService } from './window.service';
import { CropProductionAreaMapService } from './crop-production-area-map.service';
import { SuitabilityMapService } from './suitability-map.service';
import { MapConfig, MAP_CONFIG } from './map.config';

@NgModule({
  imports: [
    CommonModule,
    LeafletModule.forRoot(),
    SharedModule,
    PagesModule
  ],
  providers: [
    CropProductionAreaMapService,
    SuitabilityMapService,
    WindowService,

    { provide: MAP_CONFIG, useValue: MapConfig }
  ],
})
export class MapModule { }


