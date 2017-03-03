/*!
 * Charts Module
 *
 * Copyright(c) Exequiel Ceasar Navarrete <esnavarrete1@up.edu.ph>
 * Licensed under MIT
 */

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LineChartComponent } from './line-chart/line-chart.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    LineChartComponent
  ],
  exports: [
    LineChartComponent
  ]
})
export class ChartsModule { }


