/*!
 * App Routing
 *
 * Copyright(c) Exequiel Ceasar Navarrete <esnavarrete1@up.edu.ph>
 * Licensed under MIT
 */

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './map/home/home.component';
import { SuitabilityMapsComponent } from './map/suitability-maps/suitability-maps.component';
import { NdviMapsComponent } from './map/ndvi-maps/ndvi-maps.component';
import { RainfallMapsComponent } from './map/rainfall-maps/rainfall-maps.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    children: [
      {
        path: ''
      },

      {
        path: 'suitability-maps',
        component: SuitabilityMapsComponent
      },

      // duplicated for required url parameter `crop`
      {
        path: 'suitability-maps/:crop',
        component: SuitabilityMapsComponent
      },

      // TODO: add date validation. for now we do nothing if invalid date is provided
      // duplicated for required url parameters `startDate` and `scanRange`
      {
        path: 'ndvi/:startDate/:scanRange',
        component: NdviMapsComponent
      },

      // TODO: add date validation. for now we do nothing if invalid date is provided
      // duplicated for required url parameter `date`
      {
        path: 'rainfall-maps/:date',
        component: RainfallMapsComponent
      },
    ]
  },

  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full'
  }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: []
})
export class SaraiNg2RoutingModule { }


