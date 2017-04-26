/*!
 * App Component
 *
 * Copyright(c) Exequiel Ceasar Navarrete <esnavarrete1@up.edu.ph>
 * Licensed under MIT
 */

import { AfterViewInit, Component, ElementRef, HostListener, isDevMode, QueryList, Renderer, ViewChildren } from '@angular/core';
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
  @ViewChildren('dropdown') dropdowns: QueryList<ElementRef>;

  constructor(
    private _renderer: Renderer,
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

  enableDropdown(el) {
    // flag to determine if class should be added or not
    const add = !el.classList.contains('open');

    // add class to the element
    this._renderer.setElementClass(el, 'open', add);
  }

  // prevent redirection function for dropdown anchors
  dropdownLinkNoop(evt: Event) {
    evt.preventDefault();
  }

  @HostListener('document:click', ['$event'])
  documentClick(evt: Event) {
    this.dropdowns
      .filter((item: ElementRef) => {
        return !item.nativeElement.contains(evt.target);
      })
      .forEach((item: ElementRef) => {
        this._renderer.setElementClass(item.nativeElement, 'open', false);
      })
      ;
  }

}


