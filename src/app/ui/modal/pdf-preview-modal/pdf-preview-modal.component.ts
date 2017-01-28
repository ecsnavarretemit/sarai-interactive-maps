/*!
 * PDF Preview Modal Component
 *
 * Copyright(c) Exequiel Ceasar Navarrete <esnavarrete1@up.edu.ph>
 * Licensed under MIT
 */

import { AfterViewInit, Component, Injector, Input, OnInit } from '@angular/core';
import { BaseModalComponent } from '../base-modal/base-modal.component';

@Component({
  selector: 'app-pdf-preview-modal',
  templateUrl: './pdf-preview-modal.component.html',
  styleUrls: ['./pdf-preview-modal.component.sass']
})
export class PdfPreviewModalComponent extends BaseModalComponent implements OnInit, AfterViewInit {
  public loaderVisible: boolean = true;
  public modalVisible: boolean = false;
  public hasPdf: boolean = false;

  @Input('title') title: string = 'PDF Preview Title';
  @Input('src') src: string;
  @Input('downloadFilename') downloadFilename: string;

  constructor(injector: Injector) {
    // call the parent constructor
    super(injector);

    // retrieve properties from the injector
    this.title = injector.get('title', 'PDF Preview Title');
    this.src = injector.get('src', undefined);
    this.downloadFilename = injector.get('downloadFilename', undefined);
  }

  ngOnInit() {
    if (typeof this.src !== 'undefined') {
      this.hasPdf = true;
    }

    // if no download filename has been provided, emulate basename behavior na provide it
    if (typeof this.downloadFilename === 'undefined' && typeof this.src !== 'undefined') {
      this.downloadFilename = this.src.split(/[\\/]/).pop();
    }
  }

  onShow() {
    this.modalVisible = true;
  }

  onLoadComplete() {
    // hide the loader indicator after 3s since the pdf viewer does not provide a callback
    // after rendering the PDF
    setTimeout(() => {
      this.loaderVisible = false;
    }, 3000);
  }

}


