/*!
 * UI Module (Map)
 *
 * Copyright(c) Exequiel Ceasar Navarrete <esnavarrete1@up.edu.ph>
 * Licensed under MIT
 */

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PanelModule } from './panel';

@NgModule({
  imports: [
    CommonModule,
    PanelModule
  ],
  exports: [
    PanelModule
  ]
})
export class UiModule { }


