/*!
 * Store Module
 *
 * Copyright(c) Exequiel Ceasar Navarrete <esnavarrete1@up.edu.ph>
 * Licensed under MIT
 */

import { NgModule } from '@angular/core';
import { StoreModule as NgRxStoreModule } from '@ngrx/store';
import { MapLayersReducer } from './map-layers/map-layers.reducer';
import { SuitabilityLevelsReducer } from './suitability-levels/suitability-levels.reducer';

@NgModule({
  imports: [
    NgRxStoreModule.provideStore({
      mapLayers: MapLayersReducer,
      suitabilityLevels: SuitabilityLevelsReducer
    })
  ]
})
export class StoreModule { }


