/*!
 * Alert Modal Component
 *
 * Copyright(c) Exequiel Ceasar Navarrete <esnavarrete1@up.edu.ph>
 * Licensed under MIT
 */

import { Component, Injector, Input, OnInit } from '@angular/core';
import { BaseModalComponent } from '../base-modal/base-modal.component';

@Component({
  selector: 'app-alert-modal',
  templateUrl: './alert-modal.component.html',
  styleUrls: ['./alert-modal.component.sass']
})
export class AlertModalComponent extends BaseModalComponent {
  @Input('title') title: string = 'Alert Title';
  @Input('message') message: string = 'Alert Message';

  constructor(injector: Injector) {
    // call the parent constructor
    super(injector);

    // retrieve properties from the injector
    this.title = injector.get('title', 'Alert Title');
    this.message = injector.get('message', 'Alert Message');
  }

}


