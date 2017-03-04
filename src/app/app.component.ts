/*!
 * App Component
 *
 * Copyright(c) Exequiel Ceasar Navarrete <esnavarrete1@up.edu.ph>
 * Licensed under MIT
 */

import { AfterViewInit, Component, isDevMode } from '@angular/core';
import { ModalDirective } from 'ng2-bootstrap/modal';
import { Angulartics2, Angulartics2GoogleAnalytics } from 'angulartics2';
import { LoggerService, StreamData } from './shared';
import { AlertModalComponent, SpawnModalService } from './ui';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/debounceTime';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass']
})
export class AppComponent implements AfterViewInit {

  constructor(
    private _logger: LoggerService,
    private _modal: SpawnModalService,
    private _angulartics: Angulartics2,
    public angulartics2GoogleAnalytics: Angulartics2GoogleAnalytics
  ) {
    // set angulartics to developerMode when isDevMode() returns true
    this._angulartics.developerMode(isDevMode());
  }

  ngAfterViewInit() {
    // only get those items whose `emit` attribute is set to true
    this._logger
      .getMessageStream()
      .debounceTime(300)
      .filter((data: StreamData) => {
        return data.emit;
      })
      .subscribe((data: StreamData) => {
        // show an alert modal
        this._modal.spawn({
          component: AlertModalComponent,
          inputs: {
            openImmediately: true,
            title: data.title,
            message: data.message
          }
        });
      })
      ;
  }

}


