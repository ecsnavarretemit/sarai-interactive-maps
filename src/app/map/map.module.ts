/*!
 * Map Module
 *
 * Copyright(c) Exequiel Ceasar Navarrete <esnavarrete1@up.edu.ph>
 * Licensed under MIT
 */

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LeafletModule } from '../leaflet';
import { MapSharedModule } from './shared';
import { MapPagesModule } from './pages';

import { MapConfig, MAP_CONFIG } from './map.config';

@NgModule({
  imports: [
    CommonModule,
    LeafletModule.forRoot(),
    MapSharedModule,
    MapPagesModule
  ],
  providers: [
    { provide: MAP_CONFIG, useValue: MapConfig }
  ],
})
export class MapModule { }


