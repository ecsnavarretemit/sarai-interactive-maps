/*!
 * Suitability Maps Module
 *
 * Copyright(c) Exequiel Ceasar Navarrete <esnavarrete1@up.edu.ph>
 * Licensed under MIT
 */

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MdCheckboxModule } from '@angular2-material/checkbox';
import { TranslateModule } from '@ngx-translate/core';
import { TooltipModule } from 'ng2-bootstrap/tooltip';

import { LeafletModule } from '../../../leaflet';
import { SuitabilityMapsRoutingModule } from './suitability-maps-routing.module';

import { SuitabilityMapsComponent } from './suitability-maps/suitability-maps.component';
import { SuitabilityMapsFilterComponent } from './suitability-maps-filter/suitability-maps-filter.component';
import { InfoOverlayComponent } from './info-overlay/info-overlay.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MdCheckboxModule,
    TranslateModule,
    TooltipModule,
    LeafletModule,
    SuitabilityMapsRoutingModule,
  ],
  declarations: [
    SuitabilityMapsComponent,
    SuitabilityMapsFilterComponent,
    InfoOverlayComponent
  ],
  exports: [
    SuitabilityMapsComponent,
    SuitabilityMapsFilterComponent,
    InfoOverlayComponent
  ]
})
export class SuitabilityMapsModule { }


