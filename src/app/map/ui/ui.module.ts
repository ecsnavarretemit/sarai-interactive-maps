/*!
 * UI Module (Map)
 *
 * Copyright(c) Exequiel Ceasar Navarrete <esnavarrete1@up.edu.ph>
 * Licensed under MIT
 */

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PanelModule } from './panel';
import { MapUiFormsModule } from './forms';

@NgModule({
  imports: [
    CommonModule,
    PanelModule,
    MapUiFormsModule
  ],
  exports: [
    PanelModule,
    MapUiFormsModule
  ]
})
export class UiModule { }


