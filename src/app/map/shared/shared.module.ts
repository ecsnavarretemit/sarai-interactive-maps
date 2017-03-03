/*!
 * Shared Module
 *
 * Copyright(c) Exequiel Ceasar Navarrete <esnavarrete1@up.edu.ph>
 * Licensed under MIT
 */

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ServicesModule } from './services';

@NgModule({
  imports: [
    CommonModule,
    ServicesModule.forRoot()
  ]
})
export class SharedModule { }


