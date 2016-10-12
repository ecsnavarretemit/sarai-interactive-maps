/*!
 * App Routing
 *
 * Copyright(c) Exequiel Ceasar Navarrete <esnavarrete1@up.edu.ph>
 * Licensed under MIT
 */

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { SuitabilityMapsComponent } from './suitability-maps/suitability-maps.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent
  },

  {
    path: 'suitability-maps',
    component: SuitabilityMapsComponent
  },

  // duplicated for require url parameter `crop`
  {
    path: 'suitability-maps/:crop',
    component: SuitabilityMapsComponent
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: []
})
export class SaraiNg2RoutingModule { }


