/*!
 * App Component
 *
 * Copyright(c) Exequiel Ceasar Navarrete <esnavarrete1@up.edu.ph>
 * Licensed under MIT
 */

import { Component, Inject } from '@angular/core';
import { WindowService } from './window.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass']
})
export class AppComponent {
  public layersOpacity = 0.6;

  constructor(@Inject(WindowService) private _window: Window) { }

  openNewWindow(event: Event, windowName: string, windowFeatures = '') {
    // prevent default behavior
    event.preventDefault();

    // mark as any to prevent errors
    let href = (event.target as any).href;

    if (typeof href === 'undefined') {
      return;
    }

    // open new window
    this._window.open(href, windowName, windowFeatures);
  }

}


