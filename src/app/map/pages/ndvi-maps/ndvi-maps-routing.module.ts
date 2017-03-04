/*!
 * NDVI Maps Routing
 *
 * Copyright(c) Exequiel Ceasar Navarrete <esnavarrete1@up.edu.ph>
 * Licensed under MIT
 */

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NdviMapsComponent } from './ndvi-maps/ndvi-maps.component';

const routes: Routes = [
  {
    path: '',
    component: NdviMapsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: []
})
export class NdviMapsRoutingModule { }


