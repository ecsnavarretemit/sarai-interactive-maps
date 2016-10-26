/*!
 * App Component
 *
 * Copyright(c) Exequiel Ceasar Navarrete <esnavarrete1@up.edu.ph>
 * Licensed under MIT
 */

import { Component, Inject } from '@angular/core';
import { WindowService } from './window.service';
import { TranslateService } from 'ng2-translate';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass']
})
export class AppComponent {
  public layersOpacity = 0.6;

  constructor(@Inject(WindowService) private _window: Window, private _translate: TranslateService) {
    let defaultLang = 'en';

    // this language will be used as a fallback when a translation isn't found in the current language
    this._translate.setDefaultLang(defaultLang);

    // the lang to use, if the lang isn't available, it will use the current loader to get them
    this._translate.use(defaultLang);
  }

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


