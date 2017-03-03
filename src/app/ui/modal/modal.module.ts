/*!
 * Modal Module
 *
 * Copyright(c) Exequiel Ceasar Navarrete <esnavarrete1@up.edu.ph>
 * Licensed under MIT
 */

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalModule as BootstrapModalModule } from 'ng2-bootstrap/modal';
import { PdfViewerComponent } from 'ng2-pdf-viewer';

import { LineChartComponent } from '../charts';
import { DynamicModalComponent } from './dynamic-modal/dynamic-modal.component';
import { BaseModalComponent } from './base-modal/base-modal.component';
import { SpawnModalService } from './spawn-modal.service';
import { AlertModalComponent } from './alert-modal/alert-modal.component';
import { PdfPreviewModalComponent } from './pdf-preview-modal/pdf-preview-modal.component';
import { ChartModalComponent } from './chart-modal/chart-modal.component';

@NgModule({
  imports: [
    BootstrapModalModule,
    CommonModule
  ],
  exports: [
    DynamicModalComponent,
    BaseModalComponent,
    AlertModalComponent,
    PdfPreviewModalComponent,
    ChartModalComponent
  ],
  declarations: [
    DynamicModalComponent,
    BaseModalComponent,
    AlertModalComponent,
    PdfPreviewModalComponent,
    PdfViewerComponent,
    ChartModalComponent
  ],
  providers: [
    SpawnModalService
  ],
  entryComponents: [
    LineChartComponent
  ]
})
export class ModalModule { }


