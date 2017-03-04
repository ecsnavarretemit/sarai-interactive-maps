/*!
 * Crop Production Area Maps Routing
 *
 * Copyright(c) Exequiel Ceasar Navarrete <esnavarrete1@up.edu.ph>
 * Licensed under MIT
 */

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CropProductionAreaMapsComponent } from './crop-production-area-maps/crop-production-area-maps.component';

const routes: Routes = [
  {
    path: '',
    component: CropProductionAreaMapsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: []
})
export class CropProductionAreaMapsRoutingModule { }


