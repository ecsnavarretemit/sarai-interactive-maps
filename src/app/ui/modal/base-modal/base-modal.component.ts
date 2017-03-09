/*!
 * Base Modal Component
 *
 * Copyright(c) Exequiel Ceasar Navarrete <esnavarrete1@up.edu.ph>
 * Licensed under MIT
 */

import { AfterViewInit, Component, ElementRef, EventEmitter, Injector, Input, Output, ViewChild } from '@angular/core';
import { ModalDirective } from 'ng2-bootstrap/modal';

@Component({
  selector: 'app-base-modal',
  templateUrl: './base-modal.component.html',
  styleUrls: ['./base-modal.component.sass']
})
export class BaseModalComponent implements AfterViewInit {
  @Input('openImmediately') openImmediately = false;
  @Input('title') title = 'Modal Title';
  @Output() hide: EventEmitter<string> = new EventEmitter<string>();
  @Output() show: EventEmitter<string> = new EventEmitter<string>();
  @Output() data: EventEmitter<any> = new EventEmitter<any>();
  @ViewChild('contentModal') contentModal: ModalDirective;
  @ViewChild('contentModalTitle') contentModalTitle: ElementRef;
  @ViewChild('contentModalBody') contentModalBody: ElementRef;

  constructor(injector: Injector) {
    // retrieve properties from the injector
    this.openImmediately = injector.get('openImmediately', false);
    this.title = injector.get('openImmediately', 'Modal Title');
  }

  ngAfterViewInit() {
    if (this.openImmediately === true) {
      this.contentModal.show();
    }
  }

  onHide() {
    this.hide.emit('hide');
  }

  onShow() {
    this.show.emit('show');
  }

}


