/*!
 * Home Component
 *
 * Copyright(c) Exequiel Ceasar Navarrete <esnavarrete1@up.edu.ph>
 * Licensed under MIT
 */

import { Component, OnInit, OnDestroy, ViewChild, ViewChildren, QueryList, ElementRef, Inject, Renderer } from '@angular/core';
import { ModalDirective } from 'ng2-bootstrap/modal';
import { CookieService } from 'angular2-cookie/core';
import { TranslateService } from 'ng2-translate';
import { WindowService } from '../window.service';
import { AppLoggerService } from '../../app-logger.service';
import { LeafletButtonComponent } from '../../leaflet';
import { MapTypeComponent } from '../map-type/map-type.component';
import filter from 'lodash-es/filter';
import forEach from 'lodash-es/forEach';
import * as L from 'leaflet';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.sass']
})
export class HomeComponent implements OnInit, OnDestroy {
  public layersOpacity = 0.6;
  public mapZoom: number = 6;
  public mapCoords: L.LatLngLiteral;
  public pdfUrl: string | null  = null;
  public pdfFilename: string | null = null;
  public pdfLoaderVisible: boolean = false;
  public tmpPdfUrl: string | null = null;
  private _currentLang = 'en';
  private _cookieLangKey = 'app_lang';

  @ViewChild('controlWrapperUpperRight') controlWrapperUpperRight: ElementRef;
  @ViewChild('pdfPreviewModal') pdfPreviewModal: ModalDirective;
  @ViewChild('pdfPreviewModalTitle') pdfPreviewModalTitle: ElementRef;
  @ViewChildren(MapTypeComponent) mapTypes: QueryList<MapTypeComponent>;

  constructor(
    private _window: WindowService,
    private _logger: AppLoggerService,
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

  ngOnInit() {
    // set default coords for the map
    this.mapCoords = {
      lat: 13,
      lng: 122
    };
  }

  togglePanels(mapType: MapTypeComponent) {
    this.mapTypes
      .filter((mapTypeItem: MapTypeComponent) => {
        return mapType !== mapTypeItem && mapTypeItem.active === true;
      })
      .forEach((mapTypeItem: MapTypeComponent) => {
        mapTypeItem.toggleActiveState();
      })
      ;
  }

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
    this._window.getNativeWindow().open(windowUrl, windowName, windowFeatures);
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

  previewPdf(pdfMetadata: any) {
    // hide the loader indicator
    this.pdfLoaderVisible = false;

    // show a modal saying the pdf is not available if `pdfMetadata.url` is set to false
    // else show a modal that contains the PDF preview
    if (pdfMetadata.url !== false) {
      this.tmpPdfUrl = pdfMetadata.url;
      this.pdfFilename = pdfMetadata.filename;

      // show the loader indicator
      this.pdfLoaderVisible = true;

      // show the modal
      this.pdfPreviewModal.show();
    } else {
      this._logger.log('Image not available', 'Map image not available.', true);
    }
  }

  /**
   * When calling this function as the after-load-complete callback of the pdf component,
   * use: `[after-load-complete]="pdfLoadComplete.bind(this)"` instead of the this
   * `[after-load-complete]="pdfLoadComplete"` because the pdf component changes the value of this
   * to the value of this in the pdf component which makes us unable to get this component's `this` value.
   */
  pdfLoadComplete(pdf: any) {
    // hide the loader indicator after 3s since the pdf viewer does not provide a callback
    // after rendering the PDF
    setTimeout(() => {
      this.pdfLoaderVisible = false;
    }, 3000);
  }

  addPdf() {
    this.pdfUrl = this.tmpPdfUrl;
  }

  removePdf() {
    // hide the loader indicator
    this.pdfLoaderVisible = false;

    // destroy the PDF viewer instance
    this.pdfUrl = null;
    this.pdfFilename = null;
    this.tmpPdfUrl = null;
  }

  ngOnDestroy() {
    // make sure we remove the PDF instance
    this.removePdf();
  }

}


