/*!
 * Modal Module
 *
 * Copyright(c) Exequiel Ceasar Navarrete <esnavarrete1@up.edu.ph>
 * Licensed under MIT
 */

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalModule as BootstrapModalModule } from 'ng2-bootstrap/modal';

import { DynamicModalComponent } from './dynamic-modal/dynamic-modal.component';
import { BaseModalComponent } from './base-modal/base-modal.component';
import { SpawnModalService } from './spawn-modal.service';
import { AlertModalComponent } from './alert-modal/alert-modal.component';

@NgModule({
  imports: [
    BootstrapModalModule,
    CommonModule
  ],
  exports: [
    DynamicModalComponent,
    BaseModalComponent,
    AlertModalComponent
  ],
  declarations: [
    DynamicModalComponent,
    BaseModalComponent,
    AlertModalComponent
  ],
  providers: [
    SpawnModalService
  ]
})
export class ModalModule { }


