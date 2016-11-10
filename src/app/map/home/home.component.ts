/*!
 * Home Component
 *
 * Copyright(c) Exequiel Ceasar Navarrete <esnavarrete1@up.edu.ph>
 * Licensed under MIT
 */

import { Component, AfterViewInit, OnDestroy, ViewChild, ViewChildren, QueryList, ElementRef, Inject, Renderer } from '@angular/core';
import { ModalDirective } from 'ng2-bootstrap/ng2-bootstrap';
import { CookieService } from 'angular2-cookie/core';
import { TranslateService } from 'ng2-translate';
import { WindowService } from '../window.service';
import { AppLoggerService } from '../../app-logger.service';
import { LeafletButtonComponent } from '../../leaflet';
import { SuitabilityMapPanelComponent } from '../suitability-map-panel/suitability-map-panel.component';
import { CropProductionAreaPanelComponent } from '../crop-production-area-panel/crop-production-area-panel.component';
import { NdviPanelComponent } from '../ndvi-panel/ndvi-panel.component';
import { RainfallMapPanelComponent } from '../rainfall-map-panel/rainfall-map-panel.component';
import { filter, forEach } from 'lodash';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.sass']
})
export class HomeComponent implements AfterViewInit, OnDestroy {
  public layersOpacity = 0.6;
  public pdfUrl: string | null = null;
  public tmpPdfUrl: string | null = null;
  private _currentLang = 'en';
  private _cookieLangKey = 'app_lang';
  private _panelButtonPairs: Array<any> = [];

  @ViewChild('controlWrapperUpperRight') controlWrapperUpperRight: ElementRef;
  @ViewChild('pdfPreviewModal') pdfPreviewModal: ModalDirective;
  @ViewChild('pdfPreviewModalTitle') pdfPreviewModalTitle: ElementRef;
  @ViewChildren(LeafletButtonComponent) mapTypeButtons: QueryList<LeafletButtonComponent>;
  @ViewChildren('mapTypePanel') mapTypePanels: QueryList<any>;

  constructor(
    @Inject(WindowService) private _window: any,
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

  ngAfterViewInit() {
    this.mapTypeButtons.forEach((button: LeafletButtonComponent) => {
      let pair: any = {};

      pair.button = button;

      let result = this.mapTypePanels.filter((panel) => {
        let flag = false;

        if (
          (button.btnTooltip === 'Suitability Maps' && panel instanceof SuitabilityMapPanelComponent) ||
          (button.btnTooltip === 'Crop Production Area' && panel instanceof CropProductionAreaPanelComponent) ||
          (button.btnTooltip === 'Normalized Difference Vegetation Index (NDVI)' && panel instanceof NdviPanelComponent) ||
          (button.btnTooltip === 'Rainfall Map' && panel instanceof RainfallMapPanelComponent)
        ) {
          flag = true;
        }

        return flag;
      });

      if (result.length > 0) {
        pair.panel = result[0];
      }

      // save the pair
      this._panelButtonPairs.push(pair);
    });
  }

  toggleMapTypesState(
    button: LeafletButtonComponent,
    panel: SuitabilityMapPanelComponent | CropProductionAreaPanelComponent | NdviPanelComponent | RainfallMapPanelComponent
  ) {
    // get all button/panel pairs that are currently open
    let openedPairs = filter(this._panelButtonPairs, (pair: any) => {
      return (typeof pair.panel !== 'undefined' && pair.panel !== panel && pair.panel.controlWrapperAnimationState === 'visible');
    });

    // close all panels before opening the new one.
    if (openedPairs.length > 0) {
      forEach(openedPairs, (pair) => {
        // toggle button state
        pair.button.toggleActiveState();

        // toggle panel visibility
        pair.panel.togglePanelVisibility();
      });
    }

    // toggle button state
    button.toggleActiveState();

    // toggle panel visibility
    panel.togglePanelVisibility();
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

  previewPdf(pdfMetadata: any) {
    // show a modal saying the pdf is not available if `pdfMetadata.url` is set to false
    // else show a modal that contains the PDF preview
    if (pdfMetadata.url !== false) {
      this.tmpPdfUrl = pdfMetadata.url;
      this.pdfPreviewModal.show();
    } else {
      this._logger.log('Image not available', 'Map image not available.', true);
    }
  }

  addPdf() {
    this.pdfUrl = this.tmpPdfUrl;
  }

  removePdf() {
    // destroy the PDF viewer instance
    this.pdfUrl = null;
    this.tmpPdfUrl = null;
  }

  ngOnDestroy() {
    // empty the array by setting the length of the array to zero
    this._panelButtonPairs.length = 0;

    // make sure we remove the PDF instance
    this.removePdf();
  }

}


