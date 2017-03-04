/*!
 * Pages Routing
 *
 * Copyright(c) Exequiel Ceasar Navarrete <esnavarrete1@up.edu.ph>
 * Licensed under MIT
 */

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './home/home/home.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    children: [
      {
        path: 'suitability-maps',
        loadChildren: './suitability-maps/suitability-maps.module#SuitabilityMapsModule'
      },

      // duplicated for required url parameter `crop`
      {
        path: 'suitability-maps/:crop',
        loadChildren: './suitability-maps/suitability-maps.module#SuitabilityMapsModule'
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: []
})
export class PagesRoutingModule { }


