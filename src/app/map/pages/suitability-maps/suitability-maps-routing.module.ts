/*!
 * Suitability Maps Routing
 *
 * Copyright(c) Exequiel Ceasar Navarrete <esnavarrete1@up.edu.ph>
 * Licensed under MIT
 */

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SuitabilityMapsComponent } from './suitability-maps/suitability-maps.component';

const routes: Routes = [
  {
    path: '',
    component: SuitabilityMapsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: []
})
export class SuitabilityMapsRoutingModule { }


