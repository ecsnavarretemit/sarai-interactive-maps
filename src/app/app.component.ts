/*!
 * App Component
 *
 * Copyright(c) Exequiel Ceasar Navarrete <esnavarrete1@up.edu.ph>
 * Licensed under MIT
 */

import { Component, ViewChild, ElementRef, AfterViewInit, Renderer } from '@angular/core';
import { ModalDirective } from 'ng2-bootstrap/ng2-bootstrap';
import { AppLoggerService, StreamData } from './app-logger.service';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/debounceTime';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass']
})
export class AppComponent implements AfterViewInit {
  @ViewChild('logModal') logModal: ModalDirective;
  @ViewChild('logModalTitle') logModalTitle: ElementRef;
  @ViewChild('logModalBody') logModalBody: ElementRef;

  constructor(
    private _logger: AppLoggerService,
    private _renderer: Renderer
  ) { }

  ngAfterViewInit() {
    // only get those items whose `emit` attribute is set to true
    this._logger
      .getMessageStream()
      .debounceTime(300)
      .filter((data: StreamData) => {
        return data.emit;
      })
      .subscribe((data: StreamData) => {
        // hide the error modal before showing the data
        if (this.logModal.isShown) {
          this.logModal.hide();
        }

        // change the title and body content
        this._renderer.setText(this.logModalTitle.nativeElement, data.title);
        this._renderer.setText(this.logModalBody.nativeElement, data.message);

        this.logModal.show();
      })
      ;
  }

}


