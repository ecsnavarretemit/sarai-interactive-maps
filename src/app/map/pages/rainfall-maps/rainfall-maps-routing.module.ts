/*!
 * Rainfall Maps Routing
 *
 * Copyright(c) Exequiel Ceasar Navarrete <esnavarrete1@up.edu.ph>
 * Licensed under MIT
 */

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { InfoOverlayComponent } from './info-overlay/info-overlay.component';
import { RainfallMapsComponent } from './rainfall-maps/rainfall-maps.component';

const routes: Routes = [
  {
    path: '',
    component: RainfallMapsComponent
  },

  {
    path: ':startDate/:endDate',
    component: RainfallMapsComponent
  },

  {
    path: '',
    component: InfoOverlayComponent,
    outlet: 'info-overlay-control'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: []
})
export class RainfallMapsRoutingModule { }


