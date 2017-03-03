/*!
 * Map Module
 *
 * Copyright(c) Exequiel Ceasar Navarrete <esnavarrete1@up.edu.ph>
 * Licensed under MIT
 */

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';
import { AccordionModule } from 'ng2-bootstrap/accordion';
import { ModalModule } from 'ng2-bootstrap/modal';
import { TooltipModule } from 'ng2-bootstrap/tooltip';
import { TranslateModule } from 'ng2-translate';
import { Angulartics2Module } from 'angulartics2';
import { MapRoutingModule } from './map-routing.module';
import { LeafletModule } from '../leaflet';
import { UiModule as MapUiModule } from './ui';
import { SharedModule } from './shared';

import { WindowService } from './window.service';
import { CropProductionAreaMapService } from './crop-production-area-map.service';
import { NdviMapService } from './ndvi-map.service';
import { RainfallMapService } from './rainfall-map.service';
import { SuitabilityMapService } from './suitability-map.service';
import { MapConfig, MAP_CONFIG } from './map.config';

import { HomeComponent } from './home/home.component';
import { SuitabilityMapsComponent } from './suitability-maps/suitability-maps.component';
import { NdviMapsComponent } from './ndvi-maps/ndvi-maps.component';
import { RainfallMapsComponent } from './rainfall-maps/rainfall-maps.component';
import { MapTypeComponent } from './map-type/map-type.component';
import { CropProductionAreaMapsComponent } from './crop-production-area-maps/crop-production-area-maps.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    HttpModule,
    TooltipModule,
    AccordionModule,
    ModalModule,
    TranslateModule,
    Angulartics2Module.forChild(),
    LeafletModule,
    MapRoutingModule,
    MapUiModule,
    SharedModule
  ],
  declarations: [
    HomeComponent,
    SuitabilityMapsComponent,
    NdviMapsComponent,
    RainfallMapsComponent,
    MapTypeComponent,
    CropProductionAreaMapsComponent
  ],
  providers: [
    CropProductionAreaMapService,
    NdviMapService,
    RainfallMapService,
    SuitabilityMapService,
    WindowService,

    { provide: MAP_CONFIG, useValue: MapConfig }
  ],
  exports: [
    HomeComponent,
    SuitabilityMapsComponent,
    NdviMapsComponent,
    RainfallMapsComponent,
    MapTypeComponent,
    CropProductionAreaMapsComponent
  ]
})
export class MapModule { }


