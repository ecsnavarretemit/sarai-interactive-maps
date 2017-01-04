/*!
 * Forms Module
 *
 * Copyright(c) Exequiel Ceasar Navarrete <esnavarrete1@up.edu.ph>
 * Licensed under MIT
 */

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule as AngularFormsModule, ReactiveFormsModule } from '@angular/forms';

import { FlatpickrComponent } from './flatpickr/flatpickr.component';

@NgModule({
  imports: [
    CommonModule,
    AngularFormsModule,
    ReactiveFormsModule
  ],
  declarations: [
    FlatpickrComponent
  ],
  providers: [],
  exports: [
    FlatpickrComponent
  ]
})
export class FormsModule { }


