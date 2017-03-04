/*!
 * Rainfall Maps Routing
 *
 * Copyright(c) Exequiel Ceasar Navarrete <esnavarrete1@up.edu.ph>
 * Licensed under MIT
 */

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RainfallMapsComponent } from './rainfall-maps/rainfall-maps.component';

const routes: Routes = [
  {
    path: '',
    component: RainfallMapsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: []
})
export class RainfallMapsRoutingModule { }


