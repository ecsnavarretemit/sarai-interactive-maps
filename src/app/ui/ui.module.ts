/*!
 * UI Module
 *
 * Copyright(c) Exequiel Ceasar Navarrete <esnavarrete1@up.edu.ph>
 * Licensed under MIT
 */

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalModule } from './modal';

@NgModule({
  imports: [
    CommonModule,
    ModalModule
  ],
  exports: [
    ModalModule
  ]
})
export class UiModule { }


