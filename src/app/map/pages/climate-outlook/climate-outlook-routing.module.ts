/*!
 * Climate Outlook Routing
 *
 * Copyright(c) Exequiel Ceasar Navarrete <esnavarrete1@up.edu.ph>
 * Licensed under MIT
 */

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ClimateOutlookComponent } from './climate-outlook/climate-outlook.component';

const routes: Routes = [
  {
    path: '',
    component: ClimateOutlookComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: []
})
export class ClimateOutlookRoutingModule { }


