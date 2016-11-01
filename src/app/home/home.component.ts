/*!
 * Home Component
 *
 * Copyright(c) Exequiel Ceasar Navarrete <esnavarrete1@up.edu.ph>
 * Licensed under MIT
 */

import { Component, OnInit, ViewChild, ElementRef, Inject, Renderer } from '@angular/core';
import { CookieService } from 'angular2-cookie/core';
import { TranslateService } from 'ng2-translate';
import { WindowService } from '../window.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.sass']
})
export class HomeComponent implements OnInit {
  public layersOpacity = 0.6;
  private _currentLang = 'en';
  private _cookieLangKey = 'app_lang';

  @ViewChild('controlWrapperUpperRight') controlWrapperUpperRight: ElementRef;

  constructor(
    @Inject(WindowService) private _window: Window,
    private _translate: TranslateService,
    private _cookieService: CookieService,
    private _renderer: Renderer
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

  ngOnInit() { }

  onTileSelectorHide(event) {
    // add class to the element when the tile selector control is hidden
    this._renderer.setElementClass(
      this.controlWrapperUpperRight.nativeElement,
      'control-wrapper--tile-selector-hidden',
      true
    );
  }

  onTileSelectorShow(event) {
    // remove class to the element when the tile selector control is visible
    this._renderer.setElementClass(
      this.controlWrapperUpperRight.nativeElement,
      'control-wrapper--tile-selector-hidden',
      false
    );
  }

  openNewWindow(event: Event, windowUrl: string, windowName: string, windowFeatures = '') {
    // prevent default behavior
    event.preventDefault();

    if (typeof windowUrl === 'undefined') {
      return;
    }

    // open new window
    this._window.open(windowUrl, windowName, windowFeatures);
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


