/*!
 * Home Module
 *
 * Copyright(c) Exequiel Ceasar Navarrete <esnavarrete1@up.edu.ph>
 * Licensed under MIT
 */

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { TooltipModule } from 'ng2-bootstrap/tooltip';
import { Angulartics2Module } from 'angulartics2';

import { MapUiModule } from '../../ui';
import { LeafletModule } from '../../../leaflet';

import { HomeComponent } from './home/home.component';
import { MapTypeComponent } from './map-type/map-type.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    TranslateModule,
    TooltipModule,
    Angulartics2Module.forChild(),
    LeafletModule,
    MapUiModule,
  ],
  declarations: [
    HomeComponent,
    MapTypeComponent
  ],
  exports: [
    HomeComponent,
    MapTypeComponent
  ]
})
export class HomeModule { }


