/*!
 * Pages Module
 *
 * Copyright(c) Exequiel Ceasar Navarrete <esnavarrete1@up.edu.ph>
 * Licensed under MIT
 */

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PagesRoutingModule } from './pages-routing.module';
import { HomeModule } from './home';

@NgModule({
  imports: [
    CommonModule,
    PagesRoutingModule,
    HomeModule
  ],
  exports: [
    HomeModule
  ]
})
export class PagesModule { }


