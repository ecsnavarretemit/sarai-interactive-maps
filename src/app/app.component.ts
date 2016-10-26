/*!
 * App Component
 *
 * Copyright(c) Exequiel Ceasar Navarrete <esnavarrete1@up.edu.ph>
 * Licensed under MIT
 */

import { Component, Inject } from '@angular/core';
import { CookieService } from 'angular2-cookie/core';
import { WindowService } from './window.service';
import { TranslateService } from 'ng2-translate';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass']
})
export class AppComponent {
  public layersOpacity = 0.6;
  private _currentLang = 'en';
  private _cookieLangKey = 'app_lang';

  constructor(
    @Inject(WindowService) private _window: Window,
    private _translate: TranslateService,
    private _cookieService: CookieService
  ) {
    // retreive language preference from the cookie
    let lang = this._cookieService.get(this._cookieLangKey);

    if (typeof lang === 'undefined') {
      this._cookieService.put(this._cookieLangKey, this._currentLang);

      // use the default language
      lang = this._currentLang;
    }

    // this language will be used as a fallback when a translation isn't found in the current language
    this._translate.setDefaultLang('en');

    // the lang to use, if the lang isn't available, it will use the current loader to get them
    this._translate.use(lang);
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

  changeLang(event: Event) {
    // prevent the default behavior
    event.preventDefault();

    if (this._currentLang === 'en') {
      this._currentLang = 'fil';
    } else {
      this._currentLang = 'en';
    }

    // store the new language preference
    this._cookieService.put(this._cookieLangKey, this._currentLang);

    // change the current language
    this._translate.use(this._currentLang);
  }

}


