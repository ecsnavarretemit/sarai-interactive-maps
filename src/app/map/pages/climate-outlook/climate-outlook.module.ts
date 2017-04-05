/*!
 * Climate Outlook Module
 *
 * Copyright(c) Exequiel Ceasar Navarrete <esnavarrete1@up.edu.ph>
 * Licensed under MIT
 */

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ClimateOutlookRoutingModule } from './climate-outlook-routing.module';
import { ClimateOutlookComponent } from './climate-outlook/climate-outlook.component';

@NgModule({
  imports: [
    CommonModule,
    ClimateOutlookRoutingModule
  ],
  declarations: [
    ClimateOutlookComponent
  ]
})
export class ClimateOutlookModule { }

